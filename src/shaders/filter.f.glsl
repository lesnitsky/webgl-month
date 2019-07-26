precision mediump float;

uniform sampler2D texture;
uniform vec2 resolution;

void main() {
    gl_FragColor = texture2D(texture, gl_FragCoord.xy / resolution);
}
