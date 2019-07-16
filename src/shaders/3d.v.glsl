attribute vec3 position;
attribute float colorIndex;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform vec4 colors[6];

varying vec4 vColor;

void main() {
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    vColor = colors[int(colorIndex)];
}
