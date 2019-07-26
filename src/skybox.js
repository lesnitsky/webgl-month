import vShaderSource from './shaders/skybox.v.glsl';
import fShaderSource from './shaders/skybox.f.glsl';

import { compileShader, setupShaderInput, loadImage } from './gl-helpers';
import { Object3D } from './Object3D';
import { GLBuffer } from './GLBuffer';

import cubeObj from '../assets/objects/cube.obj';

import rightTexture from '../assets/images/skybox/right.JPG';
import leftTexture from '../assets/images/skybox/left.JPG';
import upTexture from '../assets/images/skybox/up.JPG';
import downTexture from '../assets/images/skybox/down.JPG';
import backTexture from '../assets/images/skybox/back.JPG';
import frontTexture from '../assets/images/skybox/front.JPG';

const State = {};

export async function prepare(gl) {
    const vShader = gl.createShader(gl.VERTEX_SHADER);
    const fShader = gl.createShader(gl.FRAGMENT_SHADER);

    compileShader(gl, vShader, vShaderSource);
    compileShader(gl, fShader, fShaderSource);

    const program = gl.createProgram();
    State.program = program;

    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);

    gl.linkProgram(program);
    gl.useProgram(program);

    State.programInfo = setupShaderInput(gl, program, vShaderSource, fShaderSource);

    const cube = new Object3D(cubeObj, [0, 0, 0], [0, 0, 0]);
    State.vertexBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER, cube.vertices, gl.STATIC_DRAW);

    await Promise.all([
        loadImage(rightTexture),
        loadImage(leftTexture),
        loadImage(upTexture),
        loadImage(downTexture),
        loadImage(backTexture),
        loadImage(frontTexture),
    ]).then((images) => {
        State.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, State.texture);

        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        images.forEach((image, index) => {
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + index, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        });
    });

    setupAttributes(gl);
}

function setupAttributes(gl) {
    State.vertexBuffer.bind(gl);
    gl.vertexAttribPointer(State.programInfo.attributeLocations.position, 3, gl.FLOAT, false, 0, 0);
}

export function render(gl, viewMatrix, projectionMatrix) {
    gl.useProgram(State.program);

    gl.bindTexture(gl.TEXTURE_CUBE_MAP, State.texture);

    gl.uniformMatrix4fv(State.programInfo.uniformLocations.viewMatrix, false, viewMatrix);
    gl.uniformMatrix4fv(State.programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);

    setupAttributes(gl);

    gl.drawArrays(gl.TRIANGLES, 0, State.vertexBuffer.data.length / 3);
}
