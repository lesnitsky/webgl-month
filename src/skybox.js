import vShaderSource from './shaders/skybox.v.glsl';
import fShaderSource from './shaders/skybox.f.glsl';

import { compileShader, setupShaderInput, loadImage } from './gl-helpers';
import { Object3D } from './Object3D';
import { GLBuffer } from './GLBuffer';

import cubeObj from '../assets/objects/cube.obj';
import { mat4 } from 'gl-matrix';

import rightTexture from '../assets/images/skybox/right.JPG';
import leftTexture from '../assets/images/skybox/left.JPG';
import upTexture from '../assets/images/skybox/up.JPG';
import downTexture from '../assets/images/skybox/down.JPG';
import backTexture from '../assets/images/skybox/back.JPG';
import frontTexture from '../assets/images/skybox/front.JPG';

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

const programInfo = setupShaderInput(gl, program, vShaderSource, fShaderSource);

const cube = new Object3D(cubeObj, [0, 0, 0], [0, 0, 0]);
const vertexBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER, cube.vertices, gl.STATIC_DRAW);

vertexBuffer.bind(gl);
gl.vertexAttribPointer(programInfo.attributeLocations.position, 3, gl.FLOAT, false, 0, 0);

const viewMatrix = mat4.create();
const projectionMatrix = mat4.create();

mat4.lookAt(viewMatrix, [0, 0, 0], [0, 0, -1], [0, 1, 0]);

mat4.perspective(projectionMatrix, (Math.PI / 360) * 90, canvas.width / canvas.height, 0.01, 100);

gl.uniformMatrix4fv(programInfo.uniformLocations.viewMatrix, false, viewMatrix);
gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);

gl.viewport(0, 0, canvas.width, canvas.height);

function frame() {
    gl.drawArrays(gl.TRIANGLES, 0, vertexBuffer.data.length / 3);

    requestAnimationFrame(frame);
}

Promise.all([
    loadImage(rightTexture),
    loadImage(leftTexture),
    loadImage(upTexture),
    loadImage(downTexture),
    loadImage(backTexture),
    loadImage(frontTexture),
]).then((images) => {
    frame();
});
