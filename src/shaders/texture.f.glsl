precision mediump float;

uniform sampler2D texture;
uniform vec2 resolution;

vec4 inverse(vec4 color) {
    return abs(vec4(color.rgb - 1.0, color.a));
}

vec4 blackAndWhite(vec4 color) {
    return vec4(vec3(1.0, 1.0, 1.0) * (color.r + color.g + color.b) / 3.0, color.a);
}

void main() {
    vec2 texCoord = gl_FragCoord.xy / resolution;
    gl_FragColor = texture2D(texture, texCoord);

    gl_FragColor = blackAndWhite(gl_FragColor);
}
