import { mat4, vec3 } from 'gl-matrix';
import { prepare as prepareSkybox, render as renderSkybox } from './skybox';
import { prepare as prepareTerrain, render as renderTerrain } from './minecraft-terrain';

import vShaderSource from './shaders/filter.v.glsl';
import fShaderSource from './shaders/filter.f.glsl';
import { setupShaderInput, compileShader } from './gl-helpers';
import { GLBuffer } from './GLBuffer';
import { createRect } from './shape-helpers';

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

const cameraPosition = [0, 5, 0];
const cameraFocusPoint = vec3.fromValues(0, 0, 30);
const cameraFocusPointMatrix = mat4.create();

mat4.fromTranslation(cameraFocusPointMatrix, cameraFocusPoint);

const framebuffer = gl.createFramebuffer();

const texture = gl.createTexture();

gl.bindTexture(gl.TEXTURE_2D, texture);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

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

function render() {
    mat4.translate(cameraFocusPointMatrix, cameraFocusPointMatrix, [0, 0, -30]);
    mat4.rotateY(cameraFocusPointMatrix, cameraFocusPointMatrix, Math.PI / 360);
    mat4.translate(cameraFocusPointMatrix, cameraFocusPointMatrix, [0, 0, 30]);

    mat4.getTranslation(cameraFocusPoint, cameraFocusPointMatrix);

    mat4.lookAt(viewMatrix, cameraPosition, cameraFocusPoint, [0, 1, 0]);

    renderSkybox(gl, viewMatrix, projectionMatrix);
    renderTerrain(gl, viewMatrix, projectionMatrix);

    requestAnimationFrame(render);
}

(async () => {
    await prepareSkybox(gl);
    await prepareTerrain(gl);

    render();
})();
