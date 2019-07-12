import vShaderSource from './shaders/texture.v.glsl';
import fShaderSource from './shaders/texture.f.glsl';
import { compileShader, loadImage, createTexture, setImage, setupShaderInput } from './gl-helpers';
import { createRect } from './shape-helpers';

import textureImageSrc from '../assets/images/texture.jpg';
import textureGreenImageSrc from '../assets/images/texture-green.jpg';
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

const texCoordsBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER, new Float32Array([
    ...createRect(0, 0, 1, 1), // left rect
    ...createRect(0, 0, 1, 1), // right rect
]), gl.STATIC_DRAW);

const texIndiciesBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER, new Float32Array([
    ...Array.from({ length: 4 }).fill(0), // left rect
    ...Array.from({ length: 4 }).fill(1), // right rect
]), gl.STATIC_DRAW);

const vertexPositionBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER, new Float32Array([
    ...createRect(-1, -1, 1, 2), // left rect
    ...createRect(-1, 0, 1, 2), // right rect
]), gl.STATIC_DRAW);


const programInfo = setupShaderInput(gl, program, vShaderSource, fShaderSource);

vertexPositionBuffer.bind(gl);
gl.vertexAttribPointer(programInfo.attributeLocations.position, 2, gl.FLOAT, false, 0, 0);

texCoordsBuffer.bind(gl);
gl.vertexAttribPointer(programInfo.attributeLocations.texCoord, 2, gl.FLOAT, false, 0, 0);

texIndiciesBuffer.bind(gl);
gl.vertexAttribPointer(programInfo.attributeLocations.texIndex, 1, gl.FLOAT, false, 0, 0);

const indexBuffer = new GLBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, new Uint8Array([
    // left rect
    0, 1, 2, 
    1, 2, 3, 
    
    // right rect
    4, 5, 6, 
    5, 6, 7,
]), gl.STATIC_DRAW);

Promise.all([
    loadImage(textureImageSrc),
    loadImage(textureGreenImageSrc),
]).then(([textureImg, textureGreenImg]) => {
    const texture = createTexture(gl);
    setImage(gl, texture, textureImg);

    const otherTexture = createTexture(gl);
    setImage(gl, otherTexture, textureGreenImg);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(programInfo.uniformLocations.texture, 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, otherTexture);
    gl.uniform1i(programInfo.uniformLocations.otherTexture, 1);

    gl.uniform2fv(programInfo.uniformLocations.resolution, [canvas.width, canvas.height]);

    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.drawElements(gl.TRIANGLES, indexBuffer.data.length, gl.UNSIGNED_BYTE, 0);
});


window.addEventListener('resize', () => {
    const width = document.body.offsetWidth;
    const height = document.body.offsetHeight;

    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.drawElements(gl.TRIANGLES, indexBuffer.data.length, gl.UNSIGNED_BYTE, 0);
});
