const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

const program = gl.createProgram();

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

const vShaderSource = `
attribute vec2 position;
attribute vec4 color;
uniform vec2 resolution;

varying vec4 vColor;

#define M_PI 3.1415926535897932384626433832795

void main() {
    vec2 transformedPosition = position / resolution * 2.0 - 1.0;
    gl_PointSize = 2.0;
    gl_Position = vec4(transformedPosition, 0, 1);

    vColor = color;
}
`;

const fShaderSource = `
    precision mediump float;

    varying vec4 vColor;

    void main() {
        gl_FragColor = vColor / 255.0;
    }
`;

function compileShader(shader, source) {
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    const log = gl.getShaderInfoLog(shader);

    if (log) {
        throw new Error(log);
    }
}

compileShader(vertexShader, vShaderSource);
compileShader(fragmentShader, fShaderSource);

gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);

gl.useProgram(program);

const positionLocation = gl.getAttribLocation(program, 'position');
const colorLocation = gl.getAttribLocation(program, 'color');

const resolutionUniformLocation = gl.getUniformLocation(program, 'resolution');

gl.uniform2fv(resolutionUniformLocation, [canvas.width, canvas.height]);

const rainbowColors = [
    [255, 0.0, 0.0, 255], // red
    [255, 165, 0.0, 255], // orange
    [255, 255, 0.0, 255], // yellow
    [0.0, 255, 0.0, 255], // green
    [0.0, 101, 255, 255], // skyblue
    [0.0, 0.0, 255, 255], // blue,
    [128, 0.0, 128, 255], // purple
];

const triangles = createHexagon(canvas.width / 2, canvas.height / 2, canvas.height / 2, 7);
const colors = fillWithColors(7);

function createHexagon(centerX, centerY, radius, segmentsCount) {
    const vertices = [];
    const segmentAngle =  Math.PI * 2 / (segmentsCount - 1);

    for (let i = 0; i < Math.PI * 2; i += segmentAngle) {
        const from = i;
        const to = i + segmentAngle;

        vertices.push(centerX, centerY);
        vertices.push(centerX + Math.cos(from) * radius, centerY + Math.sin(from) * radius);
        vertices.push(centerX + Math.cos(to) * radius, centerY + Math.sin(to) * radius);
    }

    return vertices;
}

function fillWithColors(segmentsCount) {
    const colors = [];

    for (let i = 0; i < segmentsCount; i++) {
        for (let j = 0; j < 3; j++) {
            if (j == 0) { // vertex in center of circle
                colors.push(0, 0, 0, 255);
            } else {
                colors.push(i / 360 * 255, 0, 0, 255);
            }
        }
    }

    return colors;
}

const positionData = new Float32Array(triangles);
const colorData = new Float32Array(colors);

const positionBuffer = gl.createBuffer(gl.ARRAY_BUFFER);
const colorBuffer = gl.createBuffer(gl.ARRAY_BUFFER);

gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, colorData, gl.STATIC_DRAW);

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW);
gl.lineWidth(10);

const attributeSize = 2;
const type = gl.FLOAT;
const nomralized = false;
const stride = 0;
const offset = 0;

gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, attributeSize, type, nomralized, stride, offset);

gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

gl.enableVertexAttribArray(colorLocation);
gl.vertexAttribPointer(colorLocation, 4, type, nomralized, stride, offset);

gl.drawArrays(gl.TRIANGLES, 0, positionData.length / 2);
