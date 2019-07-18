attribute vec3 position;
attribute vec3 normal;
attribute float colorIndex;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform vec4 colors[6];
uniform vec3 directionalLightVector;

varying vec4 vColor;

void main() {
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

    float intensity = dot(normal, normalize(directionalLightVector));

    vColor = colors[int(colorIndex)] * intensity;
}
