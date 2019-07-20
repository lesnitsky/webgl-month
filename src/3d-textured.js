import { mat4 } from 'gl-matrix';

import vShaderSource from './shaders/3d-textured.v.glsl';
import fShaderSource from './shaders/3d-textured.f.glsl';
import { compileShader, setupShaderInput } from './gl-helpers';
import cubeObj from '../assets/objects/textured-cube.obj';
import { Object3D } from './Object3D';
import { GLBuffer } from './GLBuffer';

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

const cube = new Object3D(cubeObj, [0, 0, 0], [1, 0, 0]);

const vertexBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER, cube.vertices, gl.STATIC_DRAW);
const texCoordsBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER, cube.texCoords, gl.STATIC_DRAW);

vertexBuffer.bind(gl);
gl.vertexAttribPointer(programInfo.attributeLocations.position, 3, gl.FLOAT, false, 0, 0);

texCoordsBuffer.bind(gl);
gl.vertexAttribPointer(programInfo.attributeLocations.texCoord, 2, gl.FLOAT, false, 0, 0);

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

gl.uniformMatrix4fv(programInfo.uniformLocations.viewMatrix, false, viewMatrix);
gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);

gl.viewport(0, 0, canvas.width, canvas.height);

function frame() {
    mat4.rotateY(cube.modelMatrix, cube.modelMatrix, Math.PI / 180);

    gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, cube.modelMatrix);
    gl.uniformMatrix4fv(programInfo.uniformLocations.normalMatrix, false, cube.normalMatrix);

    gl.drawArrays(gl.TRIANGLES, 0, vertexBuffer.data.length / 3);

    requestAnimationFrame(frame);
}

frame();
