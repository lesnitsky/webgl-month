attribute vec3 position;
attribute vec2 texCoord;
attribute mat4 modelMatrix;
attribute float index;

uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform float selectedObjectIndex;

varying vec2 vTexCoord;
varying vec3 vColor;

vec3 encodeObject(float id) {
    int b = int(mod(id, 255.0));
    int r = int(id) / 255 / 255;
    int g = (int(id) - b - r * 255 * 255) / 255;
    return vec3(r, g, b) / 255.0;
}

void main() {
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

    vTexCoord = texCoord;
    vColor = encodeObject(index);
}
