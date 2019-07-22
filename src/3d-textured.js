import { mat4, vec3 } from 'gl-matrix';

import vShaderSource from './shaders/3d-textured.v.glsl';
import fShaderSource from './shaders/3d-textured.f.glsl';
import { compileShader, setupShaderInput, loadImage, createTexture, setImage } from './gl-helpers';
import cubeObj from '../assets/objects/textured-cube.obj';
import { Object3D } from './Object3D';
import { GLBuffer } from './GLBuffer';
import textureSource from '../assets/images/cube-texture.png';

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

for (let i = 0; i < 4; i++) {
    gl.enableVertexAttribArray(programInfo.attributeLocations.modelMatrix + i);
}

const cube = new Object3D(cubeObj, [0, 0, 0], [1, 0, 0]);

const vertexBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER, cube.vertices, gl.STATIC_DRAW);
const texCoordsBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER, cube.texCoords, gl.STATIC_DRAW);

vertexBuffer.bind(gl);
gl.vertexAttribPointer(programInfo.attributeLocations.position, 3, gl.FLOAT, false, 0, 0);

texCoordsBuffer.bind(gl);
gl.vertexAttribPointer(programInfo.attributeLocations.texCoord, 2, gl.FLOAT, false, 0, 0);

const viewMatrix = mat4.create();
const projectionMatrix = mat4.create();

mat4.perspective(projectionMatrix, (Math.PI / 360) * 90, canvas.width / canvas.height, 0.01, 100);

gl.uniformMatrix4fv(programInfo.uniformLocations.viewMatrix, false, viewMatrix);
gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);

gl.viewport(0, 0, canvas.width, canvas.height);

const matrices = new Float32Array(100 * 100 * 4 * 4);
const modelMatrix = mat4.create();
const rotationMatrix = mat4.create();

let cubeIndex = 0;

for (let i = -50; i < 50; i++) {
    for (let j = -50; j < 50; j++) {
        const position = [i * 2, (Math.floor(Math.random() * 2) - 1) * 2, j * 2];
        mat4.fromTranslation(modelMatrix, position);

        mat4.fromRotation(rotationMatrix, Math.PI * Math.round(Math.random() * 4), [0, 1, 0]);
        mat4.multiply(modelMatrix, modelMatrix, rotationMatrix);

        modelMatrix.forEach((value, index) => {
            matrices[cubeIndex * 4 * 4 + index] = value;
        });

        cubeIndex++;
    }
}

const matricesBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER, matrices, gl.STATIC_DRAW);

const offset = 4 * 4; // 4 floats 4 bytes each
const stride = offset * 4; // 4 rows of 4 floats

const ext = gl.getExtension('ANGLE_instanced_arrays');

for (let i = 0; i < 4; i++) {
    gl.vertexAttribPointer(programInfo.attributeLocations.modelMatrix + i, 4, gl.FLOAT, false, stride, i * offset);
    ext.vertexAttribDivisorANGLE(programInfo.attributeLocations.modelMatrix + i, 1);
}

const cameraPosition = [0, 10, 0];
const cameraFocusPoint = vec3.fromValues(30, 0, 0);
const cameraFocusPointMatrix = mat4.create();

mat4.fromTranslation(cameraFocusPointMatrix, cameraFocusPoint);

function frame() {
    mat4.translate(cameraFocusPointMatrix, cameraFocusPointMatrix, [-30, 0, 0]);
    mat4.rotateY(cameraFocusPointMatrix, cameraFocusPointMatrix, Math.PI / 360);
    mat4.translate(cameraFocusPointMatrix, cameraFocusPointMatrix, [30, 0, 0]);

    mat4.getTranslation(cameraFocusPoint, cameraFocusPointMatrix);

    mat4.lookAt(viewMatrix, cameraPosition, cameraFocusPoint, [0, 1, 0]);
    gl.uniformMatrix4fv(programInfo.uniformLocations.viewMatrix, false, viewMatrix);

    matrices.forEach((matrix) => {
        gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, matrix);

        gl.drawArrays(gl.TRIANGLES, 0, vertexBuffer.data.length / 3);
    });

    requestAnimationFrame(frame);
}

loadImage(textureSource).then((image) => {
    const texture = createTexture(gl);
    setImage(gl, texture, image);

    frame();
});
