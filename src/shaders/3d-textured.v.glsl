attribute vec3 position;
attribute vec2 texCoord;
attribute mat4 modelMatrix;

uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

varying vec2 vTexCoord;

void main() {
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

    vTexCoord = texCoord;
}
