precision mediump float;

uniform sampler2D texture;
uniform vec2 resolution;

void main() {
    vec2 texCoord = gl_FragCoord.xy / resolution;
    gl_FragColor = vec4(1, 0, 0, 1);
}
