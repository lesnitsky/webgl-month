export class GLBuffer {
    constructor(gl, target, data) {
        this.target = target;
        this.data = data;
        this.glBuffer = gl.createBuffer();
    }
}
