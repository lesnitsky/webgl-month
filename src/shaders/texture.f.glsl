precision mediump float;

uniform sampler2D texture;
uniform vec2 resolution;

vec4 inverse(vec4 color) {
    return abs(vec4(color.rgb - 1.0, color.a));
}

vec4 blackAndWhite(vec4 color) {
    return vec4(vec3(1.0, 1.0, 1.0) * (color.r + color.g + color.b) / 3.0, color.a);
}

vec4 sepia(vec4 color) {
    vec3 sepiaColor = vec3(112, 66, 20) / 255.0;
    return vec4(
        mix(color.rgb, sepiaColor, 0.4),
        color.a
    );
}

void main() {
    vec2 texCoord = gl_FragCoord.xy / resolution;
    gl_FragColor = texture2D(texture, texCoord);

    gl_FragColor = sepia(gl_FragColor);
}
