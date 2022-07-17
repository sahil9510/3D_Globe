import * as THREE from 'three'
import gsap from 'gsap'

import vertexShader from './shaders/vertexShader.glsl'
import fragmentShader from './shaders/fragmentShader.glsl'

import atmoVertexShader from './shaders/atmoVertex.glsl'
import atmoFragmentShader from './shaders/atmoFragment.glsl'

const canvas = document.querySelector('.webgl')

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const cursor = {}
cursor.x = 0;
cursor.y = 0;

const canvasContainer = document.querySelector('#canvasContainer')

const textureLoader = new THREE.TextureLoader();
const globeTexture = textureLoader.load('./static/globe1.jpg')
const normalTexture = textureLoader.load('./static/normal.tif')
const cloudsTexture = textureLoader.load('./static/clouds.jpg')
const starTexture = textureLoader.load('./static/alpha.png')


const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75,canvasContainer.offsetWidth/canvasContainer.offsetHeight,0.1,1000);
camera.position.z = 15;


addEventListener('mousemove', (event)=>{
    cursor.x = (event.clientX/ sizes.width)*2 - 1;
    cursor.y = -(event.clientY/ sizes.height)*2 + 1;
})

// Sphere
const sphereGeometry = new THREE.SphereBufferGeometry(5,50,50)
const sphereMaterial = new THREE.ShaderMaterial({
    uniforms: {
        globeTexture: {value: globeTexture},
        normalTexture: {value: normalTexture},
        cloudsTexture: {value: cloudsTexture}
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true
})
const sphere = new THREE.Mesh(sphereGeometry,sphereMaterial)


// Atmosphere
const atmosphereGeometry = new THREE.SphereBufferGeometry(6,50,50)
const atmosphereMaterial = new THREE.ShaderMaterial({
    vertexShader: atmoVertexShader,
    fragmentShader: atmoFragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide
})
const atmosphere = new THREE.Mesh(atmosphereGeometry,atmosphereMaterial)
atmosphere.scale.set(1.1,1.1,1.1)
scene.add(atmosphere)

const group = new THREE.Group()
group.add(sphere)
scene.add(group)

// Stars
const starCount = 10000;
const starVertices = new Float32Array(starCount*3);

for(let i=0;i< starCount;i++){
    starVertices[i + 0] = (Math.random() - 0.5) * 2000
    starVertices[i + 1] = (Math.random() - 0.5) * 2000
    starVertices[i + 2] = -Math.random() * 2000
    
}

const starGeometry = new THREE.BufferGeometry()
const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    transparent: true,
    // alphaMap: starTexture
})

starGeometry.setAttribute('position',new THREE.BufferAttribute(starVertices,3))

const stars = new THREE.Points(
    starGeometry,starMaterial
)

scene.add(stars)


const renderer = new THREE.WebGL1Renderer({
    canvas: canvas,
    antialias: true
})

renderer.setSize(canvasContainer.offsetWidth,canvasContainer.offsetHeight)
renderer.setPixelRatio(Math.min(2,window.devicePixelRatio))

const tick = () =>{

    sphere.rotation.y += 0.002
    gsap.to(group.rotation, {
        x: -cursor.y*0.3,
        y: cursor.x * 0.5,
        duration: 2
    })

    renderer.render(scene,camera)
    window.requestAnimationFrame(tick)
}
tick()