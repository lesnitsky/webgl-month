import { mat4, vec3 } from 'gl-matrix';
import { prepare as prepareSkybox, render as renderSkybox } from './skybox';
import { prepare as prepareTerrain, render as renderTerrain } from './minecraft-terrain';

import vShaderSource from './shaders/filter.v.glsl';
import fShaderSource from './shaders/filter.f.glsl';
import { setupShaderInput, compileShader } from './gl-helpers';
import { GLBuffer } from './GLBuffer';
import { createRect } from './shape-helpers';
import { RenderBuffer } from './RenderBuffer';

const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

const width = document.body.offsetWidth;
const height = document.body.offsetHeight;

canvas.width = width * devicePixelRatio;
canvas.height = height * devicePixelRatio;

canvas.style.width = `${width}px`;
canvas.style.height = `${height}px`;

const viewMatrix = mat4.create();
const projectionMatrix = mat4.create();

mat4.lookAt(viewMatrix, [0, 0, 0], [0, 0, -1], [0, 1, 0]);

mat4.perspective(projectionMatrix, (Math.PI / 360) * 90, canvas.width / canvas.height, 0.01, 142);

gl.viewport(0, 0, canvas.width, canvas.height);

const cameraPosition = [0, 10, 0];
const cameraFocusPoint = vec3.fromValues(30, 0, 30);
const cameraFocusPointMatrix = mat4.create();

mat4.fromTranslation(cameraFocusPointMatrix, cameraFocusPoint);

const offscreenRenderBuffer = new RenderBuffer(gl);
const coloredCubesRenderBuffer = new RenderBuffer(gl);

const vShader = gl.createShader(gl.VERTEX_SHADER);
const fShader = gl.createShader(gl.FRAGMENT_SHADER);

compileShader(gl, vShader, vShaderSource);
compileShader(gl, fShader, fShaderSource);

const program = gl.createProgram();

gl.attachShader(program, vShader);
gl.attachShader(program, fShader);

gl.linkProgram(program);
gl.useProgram(program);

const vertexPositionBuffer = new GLBuffer(
    gl,
    gl.ARRAY_BUFFER,
    new Float32Array([...createRect(-1, -1, 2, 2)]),
    gl.STATIC_DRAW
);

const indexBuffer = new GLBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, new Uint8Array([0, 1, 2, 1, 2, 3]), gl.STATIC_DRAW);

const programInfo = setupShaderInput(gl, program, vShaderSource, fShaderSource);

vertexPositionBuffer.bind(gl);
gl.vertexAttribPointer(programInfo.attributeLocations.position, 2, gl.FLOAT, false, 0, 0);

gl.uniform2f(programInfo.uniformLocations.resolution, canvas.width, canvas.height);

let selectedObjectIndex = -1;

function render() {
    offscreenRenderBuffer.clear(gl);

    mat4.lookAt(viewMatrix, cameraPosition, cameraFocusPoint, [0, 1, 0]);

    renderSkybox(gl, viewMatrix, projectionMatrix);
    renderTerrain(gl, viewMatrix, projectionMatrix, false, selectedObjectIndex);

    gl.useProgram(program);

    vertexPositionBuffer.bind(gl);
    gl.vertexAttribPointer(programInfo.attributeLocations.position, 2, gl.FLOAT, false, 0, 0);

    gl.uniform2f(programInfo.uniformLocations.resolution, canvas.width, canvas.height);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, offscreenRenderBuffer.texture);

    gl.drawElements(gl.TRIANGLES, indexBuffer.data.length, gl.UNSIGNED_BYTE, 0);

    requestAnimationFrame(render);
}

function rgbToInt(r, g, b) {
    return b + g * 255 + r * 255 ** 2;
}

document.body.addEventListener('click', (e) => {
    coloredCubesRenderBuffer.bind(gl);

    renderTerrain(gl, viewMatrix, projectionMatrix, true);

    const pixels = new Uint8Array(canvas.width * canvas.height * 4);
    gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

    const x = e.clientX * devicePixelRatio;
    const y = (canvas.offsetHeight - e.clientY) * devicePixelRatio;

    const rowsToSkip = y * canvas.width * 4;
    const col = x * 4;

    const pixelIndex = rowsToSkip + col;

    const r = pixels[pixelIndex];
    const g = pixels[pixelIndex + 1];
    const b = pixels[pixelIndex + 2];
    const a = pixels[pixelIndex + 3];

    const index = rgbToInt(r, g, b);

    selectedObjectIndex = index;
});

(async () => {
    await prepareSkybox(gl);
    await prepareTerrain(gl);

    render();
})();
