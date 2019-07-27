precision mediump float;
uniform sampler2D texture;

varying vec2 vTexCoord;
varying vec3 vColor;

void main() {
    gl_FragColor = texture2D(texture, vTexCoord * vec2(1, -1) + vec2(0, 1));
}
