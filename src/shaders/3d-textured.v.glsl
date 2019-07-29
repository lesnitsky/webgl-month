attribute vec3 position;
attribute vec2 texCoord;
attribute mat4 modelMatrix;
attribute float index;

uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform float selectedObjectIndex;

varying vec2 vTexCoord;
varying vec3 vColor;
varying vec4 vColorMultiplier;

vec3 encodeObject(float id) {
    int b = int(mod(id, 255.0));
    int r = int(id) / 255 / 255;
    int g = (int(id) - b - r * 255 * 255) / 255;
    return vec3(r, g, b) / 255.0;
}

void main() {
    mat4 modelView = viewMatrix * modelMatrix;

    gl_Position = projectionMatrix * modelView * vec4(position, 1.0);

    float depth = (modelView * vec4(position, 1.0)).z;

    vTexCoord = texCoord;
    vColor = encodeObject(index);
    
    if (selectedObjectIndex == index) {
        vColorMultiplier = vec4(1.5, 1.5, 1.5, 1.0);
    } else {
        vColorMultiplier = vec4(1.0, 1.0, 1.0, 1.0);
    }
}
