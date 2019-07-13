import vShaderSource from './shaders/rotating-square.v.glsl';
import fShaderSource from './shaders/rotating-square.f.glsl';
import { setupShaderInput, compileShader } from './gl-helpers';
import { createRect } from './shape-helpers';
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

const programInfo = setupShaderInput(gl, program, vShaderSource, fShaderSource);

const vertexPositionBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER, new Float32Array([
    ...createRect(canvas.width / 2 - 100, canvas.height / 2 - 100, 200, 200),
]), gl.STATIC_DRAW);
