const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

const program = gl.createProgram();

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

const vShaderSource = `
void main() {
    gl_Position = vec4(0, 0, 0, 1);
}
`;

gl.shaderSource(vertexShader, vShaderSource);
