precision mediump float;

varying vec4 vColor;

void main() {
    gl_FragColor = vColor / 255.0;
    gl_FragColor.a = 1.0;
}
