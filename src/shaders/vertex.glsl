attribute vec2 position;
uniform vec2 resolution;

#define M_PI 3.1415926535897932384626433832795

void main() {
    vec2 transformedPosition = position / resolution * 2.0 - 1.0;
    gl_PointSize = 2.0;
    gl_Position = vec4(transformedPosition, 0, 1);
}
