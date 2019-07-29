precision mediump float;
uniform sampler2D texture;

varying vec2 vTexCoord;
varying vec3 vColor;

uniform float renderIndices;
varying vec4 vColorMultiplier;
varying float vFogAmount;

void main() {
    gl_FragColor = texture2D(texture, vTexCoord * vec2(1, -1) + vec2(0, 1)) * vColorMultiplier;

    vec3 fogColor = vec3(1.0, 1.0, 1.0);

    if (renderIndices == 1.0) {
        gl_FragColor.rgb = vColor;
    }
}
