export class RenderBuffer {
    constructor(gl) {
        this.framebuffer = gl.createFramebuffer();
        this.texture = gl.createTexture();
    }
}
