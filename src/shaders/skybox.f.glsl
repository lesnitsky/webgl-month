precision mediump float;

varying vec3 vTexCoord;
uniform samplerCube skybox;

void main() {
    gl_FragColor = textureCube(skybox, vTexCoord);
}
