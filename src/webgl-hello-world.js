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

const triangles = createRect(0, 0, canvas.height, canvas.height);

function createHexagon(centerX, centerY, radius, segmentsCount) {
    const vertexData = [];
    const segmentAngle =  Math.PI * 2 / (segmentsCount - 1);

    for (let i = 0; i < Math.PI * 2; i += segmentAngle) {
        const from = i;
        const to = i + segmentAngle;

        const color = rainbowColors[i / segmentAngle];

        vertexData.push(centerX, centerY);
        vertexData.push(...color);

        vertexData.push(centerX + Math.cos(from) * radius, centerY + Math.sin(from) * radius);
        vertexData.push(...color);

        vertexData.push(centerX + Math.cos(to) * radius, centerY + Math.sin(to) * radius);
        vertexData.push(...color);
    }

    return vertexData;
}

function fillWithColors(segmentsCount) {
    const colors = [];

    for (let i = 0; i < segmentsCount; i++) {
        for (let j = 0; j < 3; j++) {
            colors.push(...rainbowColors[i]);
        }
    }

    return colors;
}

const vertexData = new Float32Array(triangles);
const vertexBuffer = gl.createBuffer(gl.ARRAY_BUFFER);

gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
gl.lineWidth(10);

const attributeSize = 2;
const type = gl.FLOAT;
const nomralized = false;
const stride = 24;
const offset = 0;

gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, attributeSize, type, nomralized, stride, offset);

gl.enableVertexAttribArray(colorLocation);
gl.vertexAttribPointer(colorLocation, 4, type, nomralized, stride, 8);

gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 6);
