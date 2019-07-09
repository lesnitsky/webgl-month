attribute vec2 position;
attribute vec2 texCoord;

void main() {
    gl_Position = vec4(position, 0, 1);
}
