uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;

varying vec2 vUv;
varying float vElevation;

void main(){

    float mixedStrength = (vElevation + uColorOffset) * uColorMultiplier ;
    vec3 mixedColor = mix(uDepthColor, uSurfaceColor, mixedStrength);

    gl_FragColor = vec4(mixedColor ,1.0);

    #ifdef USE_FOG
          #ifdef USE_LOGDEPTHBUF_EXT
              float depth = gl_FragDepthEXT / gl_FragCoord.w;
          #else
              float depth = gl_FragCoord.z / gl_FragCoord.w;
          #endif
          float fogFactor = smoothstep( fogNear, fogFar, depth );
          gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
    #endif
}