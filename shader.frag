#version 300 es

precision highp float;

in highp vec2 texPosition;

uniform sampler2D tex;

out vec4 fragColor;

vec3 getPalette(int n);

void main() {
    // TODO Add palette
    float px = texture(tex, texPosition).r;
    int low = int(px * 255.0) & 0xF;
    int high = (int(px * 255.0) & 0xF0) >> 4;

    if (int(texPosition.x * 64.0) % 2 == 0) {
        fragColor = vec4(getPalette(low), 1.0);
    } else {
        fragColor = vec4(getPalette(high), 1.0);
    }
}

vec3 getPalette(int n) {
    if (n == 0) { return vec3(0.0/255.0, 0.0 / 255.0, 0.0 / 255.0); }           // 	black
    if (n == 1) { return vec3(29.0/255.0, 43.0 / 255.0, 83.0 / 255.0); }        // 	dark-blue
    if (n == 2) { return vec3(126.0/255.0, 37.0 / 255.0, 83.0 / 255.0); }       // 	dark-purple
    if (n == 3) { return vec3(0.0/255.0, 135.0 / 255.0, 81.0 / 255.0); }        // 	dark-green
    if (n == 4) { return vec3(171.0/255.0, 82.0 / 255.0, 54.0 / 255.0); }       // 	brown
    if (n == 5) { return vec3(95.0/255.0, 87.0 / 255.0, 79.0 / 255.0); }        // 	dark-grey
    if (n == 6) { return vec3(194.0/255.0, 195.0 / 255.0, 199.0 / 255.0); }     // 	light-grey
    if (n == 7) { return vec3(255.0/255.0, 241.0 / 255.0, 232.0 / 255.0); }     // 	white
    if (n == 8) { return vec3(255.0/255.0, 0.0 / 255.0, 77.0 / 255.0); }        // 	red
    if (n == 9) { return vec3(255.0/255.0, 163.0 / 255.0, 0.0 / 255.0); }       // 	orange
    if (n == 10) { return vec3(255.0/255.0, 236.0 / 255.0, 39.0 / 255.0); }     // 	yellow
    if (n == 11) { return vec3(0.0/255.0, 228.0 / 255.0, 54.0 / 255.0); }       // 	green
    if (n == 12) { return vec3(41.0/255.0, 173.0 / 255.0, 255.0 / 255.0); }     // 	blue
    if (n == 13) { return vec3(131.0/255.0, 118.0 / 255.0, 156.0 / 255.0); }    // 	lavender
    if (n == 14) { return vec3(255.0/255.0, 119.0 / 255.0, 168.0 / 255.0); }    // 	pink
    if (n == 15) { return vec3(255.0/255.0, 204.0 / 255.0, 170.0 / 255.0); }    // 	light-peach 
}