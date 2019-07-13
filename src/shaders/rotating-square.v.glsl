attribute vec2 position;
uniform vec2 resolution;

void main() {
    gl_Position = vec4(position / resolution * 2.0 - 1.0, 0, 1);
}
