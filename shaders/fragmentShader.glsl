uniform sampler2D globeTexture;
uniform sampler2D normalTexture;
uniform sampler2D cloudsTexture;

varying vec2 vUv;
varying vec3 vNormal;
void main(){
    float intensity = 1.05 - dot(vNormal , vec3(0.0, 0.0, 1.0));
    vec3 atmosphere = vec3(0.3, 0.6, 1.0) * pow(intensity,1.5);

    vec4 cloudsTex = texture2D(cloudsTexture,vUv);
    cloudsTex = vec4(cloudsTex.xyz,0.0);
    vec4 textureColor = texture2D(globeTexture,vUv) + vec4(atmosphere,0.0);



    gl_FragColor = textureColor + cloudsTex;
}