import vShaderSource from './shaders/texture.v.glsl';
import fShaderSource from './shaders/texture.f.glsl';
import { compileShader, loadImage, createTexture, setImage } from './gl-helpers';
import { createRect } from './shape-helpers';

import textureImageSrc from '../assets/images/texture.jpg';
import textureGreenImageSrc from '../assets/images/texture-green.jpg';

const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

const vShader = gl.createShader(gl.VERTEX_SHADER);
const fShader = gl.createShader(gl.FRAGMENT_SHADER);

compileShader(gl, vShader, vShaderSource);
compileShader(gl, fShader, fShaderSource);

const program = gl.createProgram();

gl.attachShader(program, vShader);
gl.attachShader(program, fShader);

gl.linkProgram(program);
gl.useProgram(program);

const texCoords = new Float32Array([
    ...createRect(0, 0, 1, 1), // left rect
    ...createRect(0, 0, 1, 1), // right rect
]);
const texCoordsBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, texCoordsBuffer);
gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);

const texIndicies = new Float32Array([
    ...Array.from({ length: 4 }).fill(0), // left rect
    ...Array.from({ length: 4 }).fill(1), // right rect
]);
const texIndiciesBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, texIndiciesBuffer);
gl.bufferData(gl.ARRAY_BUFFER, texIndicies, gl.STATIC_DRAW);

const vertexPosition = new Float32Array([
    ...createRect(-1, -1, 1, 2), // left rect
    ...createRect(-1, 0, 1, 2), // right rect
]);
const vertexPositionBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexPosition, gl.STATIC_DRAW);

const attributeLocations = {
    position: gl.getAttribLocation(program, 'position'),
    texCoord: gl.getAttribLocation(program, 'texCoord'),
    texIndex: gl.getAttribLocation(program, 'texIndex'),
};

const uniformLocations = {
    texture: gl.getUniformLocation(program, 'texture'),
    otherTexture: gl.getUniformLocation(program, 'otherTexture'),
    resolution: gl.getUniformLocation(program, 'resolution'),
};

gl.enableVertexAttribArray(attributeLocations.position);
gl.vertexAttribPointer(attributeLocations.position, 2, gl.FLOAT, false, 0, 0);

gl.bindBuffer(gl.ARRAY_BUFFER, texCoordsBuffer);

gl.enableVertexAttribArray(attributeLocations.texCoord);
gl.vertexAttribPointer(attributeLocations.texCoord, 2, gl.FLOAT, false, 0, 0);

gl.bindBuffer(gl.ARRAY_BUFFER, texIndiciesBuffer);

gl.enableVertexAttribArray(attributeLocations.texIndex);
gl.vertexAttribPointer(attributeLocations.texIndex, 1, gl.FLOAT, false, 0, 0);

const vertexIndices = new Uint8Array([
    // left rect
    0, 1, 2, 
    1, 2, 3, 
    
    // right rect
    4, 5, 6, 
    5, 6, 7,
]);
const indexBuffer = gl.createBuffer();

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, vertexIndices, gl.STATIC_DRAW);

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
    gl.uniform1i(uniformLocations.texture, 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, otherTexture);
    gl.uniform1i(uniformLocations.otherTexture, 1);

    gl.uniform2fv(uniformLocations.resolution, [canvas.width, canvas.height]);

    gl.drawElements(gl.TRIANGLES, vertexIndices.length, gl.UNSIGNED_BYTE, 0);
});
