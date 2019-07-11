export class GLBuffer {
    constructor(gl, target, data) {
        this.target = target;
        this.data = data;
        this.glBuffer = gl.createBuffer();
    }

    bind(gl) {
        gl.bindBuffer(this.target, this.glBuffer);
    }

    setData(gl, data, usage) {
        this.data = data;
        this.bind(gl);
        gl.bufferData(this.target, this.data, usage);
    }
}
