attribute vec2 position;
attribute vec2 texCoord;
attribute float texIndex;

varying vec2 vTexCoord;
varying float vTexIndex;

void main() {
    gl_Position = vec4(position, 0, 1);

    vTexCoord = texCoord;
    vTexIndex = texIndex;
}
