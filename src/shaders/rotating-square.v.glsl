attribute vec2 position;
uniform vec2 resolution;

uniform mat2 rotationMatrix;

void main() {
    gl_Position = vec4((position / resolution * 2.0 - 1.0) * rotationMatrix, 0, 1);
}
