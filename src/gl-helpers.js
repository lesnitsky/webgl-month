export function compileShader(gl, shader, source) {
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    const log = gl.getShaderInfoLog(shader);

    if (log) {
        throw new Error(log);
    }
}
