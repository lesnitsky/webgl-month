attribute vec2 position;
attribute vec2 texCoord;

varying vec2 vTexCoord;

void main() {
    gl_Position = vec4(position, 0, 1);

    vTexCoord = texCoord;
}
