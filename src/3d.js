import { mat4 } from 'gl-matrix';

import vShaderSource from './shaders/3d.v.glsl';
import fShaderSource from './shaders/3d.f.glsl';
import { compileShader, setupShaderInput, parseObj } from './gl-helpers';
import { GLBuffer } from './GLBuffer';
import monkeyObj from '../assets/objects/monkey.obj';

const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

const width = document.body.offsetWidth;
const height = document.body.offsetHeight;

canvas.width = width * devicePixelRatio;
canvas.height = height * devicePixelRatio;

canvas.style.width = `${width}px`;
canvas.style.height = `${height}px`;

const vShader = gl.createShader(gl.VERTEX_SHADER);
const fShader = gl.createShader(gl.FRAGMENT_SHADER);

compileShader(gl, vShader, vShaderSource);
compileShader(gl, fShader, fShaderSource);

const program = gl.createProgram();

gl.attachShader(program, vShader);
gl.attachShader(program, fShader);

gl.linkProgram(program);
gl.useProgram(program);

gl.enable(gl.DEPTH_TEST);

const programInfo = setupShaderInput(gl, program, vShaderSource, fShaderSource);

const { vertices, indices } = parseObj(monkeyObj);

const faceColors = [
    [0.5, 0.5, 0.5, 1.0]
];

const colors = [];

for (var j = 0; j < indices.length / 3; ++j) {
    colors.push(0, 0, 0, 0);
}

faceColors.forEach((color, index) => {
    gl.uniform4fv(programInfo.uniformLocations[`colors[${index}]`], color);
});

const vertexBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
const colorsBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
const indexBuffer = new GLBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

vertexBuffer.bind(gl);
gl.vertexAttribPointer(programInfo.attributeLocations.position, 3, gl.FLOAT, false, 0, 0);

colorsBuffer.bind(gl);
gl.vertexAttribPointer(programInfo.attributeLocations.colorIndex, 1, gl.FLOAT, false, 0, 0);

const modelMatrix = mat4.create();
const viewMatrix = mat4.create();
const projectionMatrix = mat4.create();

mat4.lookAt(
    viewMatrix,
    [0, 0, -7],
    [0, 0, 0],
    [0, 1, 0],
);

mat4.perspective(
    projectionMatrix,
    Math.PI / 360 * 90,
    canvas.width / canvas.height,
    0.01,
    100,
);

gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, modelMatrix);
gl.uniformMatrix4fv(programInfo.uniformLocations.viewMatrix, false, viewMatrix);
gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);

gl.viewport(0, 0, canvas.width, canvas.height);

gl.drawElements(gl.TRIANGLES, indexBuffer.data.length, gl.UNSIGNED_SHORT, 0);

function frame() {
    mat4.rotateY(modelMatrix, modelMatrix, Math.PI / 180);

    gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, modelMatrix);
    gl.drawElements(gl.TRIANGLES, indexBuffer.data.length, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(frame);
}

frame();
