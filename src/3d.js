import { mat4, vec3 } from 'gl-matrix';

import vShaderSource from './shaders/3d.v.glsl';
import fShaderSource from './shaders/3d.f.glsl';
import { compileShader, setupShaderInput, parseObj } from './gl-helpers';
import { GLBuffer } from './GLBuffer';
import monkeyObj from '../assets/objects/monkey.obj';
import torusObj from '../assets/objects/torus.obj';
import coneObj from '../assets/objects/cone.obj';

import { Object3D } from './Object3D';

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

const monkey = new Object3D(monkeyObj, [0, 0, 0], [1, 0, 0]);
const torus = new Object3D(torusObj, [-3, 0, 0], [0, 1, 0]);
const cone = new Object3D(coneObj, [3, 0, 0], [0, 0, 1]);

const objects = [
    monkey,
    torus,
    cone,
];

const vertexBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER, monkey.vertices, gl.STATIC_DRAW);
const normalsBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER, monkey.normals, gl.STATIC_DRAW);

vertexBuffer.bind(gl);
gl.vertexAttribPointer(programInfo.attributeLocations.position, 3, gl.FLOAT, false, 0, 0);

normalsBuffer.bind(gl);
gl.vertexAttribPointer(programInfo.attributeLocations.normal, 3, gl.FLOAT, false, 0, 0);

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

gl.uniform3fv(programInfo.uniformLocations.directionalLightVector, [0, 0, -7]);

gl.viewport(0, 0, canvas.width, canvas.height);

function frame() {
    objects.forEach((object) => {
        mat4.rotateY(object.modelMatrix, object.modelMatrix, Math.PI / 180);

        gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, object.modelMatrix);
        gl.uniformMatrix4fv(programInfo.uniformLocations.normalMatrix, false, object.normalMatrix);

        gl.uniform3fv(programInfo.uniformLocations.color, object.color);

        vertexBuffer.setData(gl, object.vertices, gl.STATIC_DRAW);
        normalsBuffer.setData(gl, object.normals, gl.STATIC_DRAW);

        gl.drawArrays(gl.TRIANGLES, 0, vertexBuffer.data.length / 3);
    });

    requestAnimationFrame(frame);
}

frame();
