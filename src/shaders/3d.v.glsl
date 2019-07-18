attribute vec3 position;
attribute vec3 normal;
attribute float colorIndex;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 normalMatrix;
uniform vec4 colors[6];
uniform vec3 directionalLightVector;

varying vec4 vColor;

void main() {
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

    vec3 transformedNormal = (normalMatrix * vec4(normal, 1.0)).xyz;
    float intensity = dot(transformedNormal, normalize(directionalLightVector));

    vColor.rgb = vec3(0.3, 0.3, 0.3) + colors[int(colorIndex)].rgb * intensity;
    vColor.a = 1.0;
}
