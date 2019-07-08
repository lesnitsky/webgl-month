export function compileShader(gl, shader, source) {
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    const log = gl.getShaderInfoLog(shader);

    if (log) {
        throw new Error(log);
    }
}

export async function loadImage(src) {
    const img = new Image();

    let _resolve;
    const p = new Promise((resolve) => _resolve = resolve);

    img.onload = () => {
        _resolve(img);
    }

    img.src = src;

    return p;
}
