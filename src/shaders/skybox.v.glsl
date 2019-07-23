attribute vec3 position;
varying vec3 vTexCoord;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;

void main() {
    vTexCoord = position;
}
