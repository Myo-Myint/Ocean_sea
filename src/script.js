import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import * as Stats from 'stats.js'

import waterVertexShader from './shaders/water/vertex.glsl'
import waterFragmentShader from './shaders/water/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 })
const debugObject = {}
gui.close()

//stats
const stats = new Stats();
stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Fog
 */
 const fog = new THREE.Fog('#d1dcdf', 5, 15)
 scene.fog = fog
 
/**
 * lightings
 */
 const doorLight = new THREE.PointLight('#ff7d46', 1, 7)
 doorLight.position.set(0, 2.2, 2.7)

 gui.add(doorLight.position, 'x').min(0).max(100).step(0.001).name('Light Position x')
 gui.add(doorLight.position, 'y').min(0).max(100).step(0.001).name('Light Position y')
 gui.add(doorLight.position, 'z').min(0).max(100).step(0.001).name('Light Position z')

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneBufferGeometry(40, 40, 258, 258)

//colors
debugObject.depthColor = '#065589' //#186691
debugObject.surfaceColor = '#9bd8ff'

// Material
const waterMaterial = new THREE.ShaderMaterial({
    side : THREE.DoubleSide,
    fog : true ,
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
    uniforms: {
        uTime : { value : 0 },
        uBigWavesSpeed : { value : 0.75 },
        uBigwavesElevation : { value : 0.07 },
        uBigwavesFrequency : { value : new THREE.Vector2(0.4, 0.5) },

        uDepthColor : { value : new THREE.Color(debugObject.depthColor)},
        uSurfaceColor : { value : new THREE.Color(debugObject.surfaceColor)},
        uColorOffset: { value: 0.022 },
        uColorMultiplier: { value: 3.6  },

        uSmallwavesSpeed : { value : 0.5 },
        uSmallWavesElevation: { value: 0.063 },
        uSmallWavesFrequency: { value: 0.7 },
        uSmallIterations: { value: 4 },

        fogColor:    { value: scene.fog.color },
        fogNear:     { value: scene.fog.near },
        fogFar:      { value: scene.fog.far }
    }
})

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)


//add to gui
gui.add(waterMaterial.uniforms.uBigwavesElevation, 'value').min(0).max(10).step(0.001).name('uBigwavesElevation')
gui.add(waterMaterial.uniforms.uBigwavesFrequency.value, 'x').min(0).max(10).step(0.001).name('uBigwavesFrequencyX')
gui.add(waterMaterial.uniforms.uBigwavesFrequency.value, 'y').min(0).max(10).step(0.001).name('uBigwavesFrequencyY')
gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value').min(0).max(10).step(0.001).name('uBigWavesSpeed')
gui.add(waterMaterial.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('uColorOffset')
gui.add(waterMaterial.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.001).name('uColorMultiplier')
gui.add(waterMaterial.uniforms.uSmallwavesSpeed , 'value').min(0).max(4).step(0.001).name('uSmallwavesSpeed :')
gui.add(waterMaterial.uniforms.uSmallWavesElevation, 'value').min(0).max(10).step(0.0001).name('uSmallWavesElevation')
gui.add(waterMaterial.uniforms.uSmallWavesFrequency, 'value').min(0).max(10).step(0.001).name('uSmallWavesFrequency')
gui.add(waterMaterial.uniforms.uSmallIterations, 'value').min(0).max(5).step(1).name('uSmallIterations')


//handle colors
gui.addColor(debugObject, 'depthColor')
    .name('DepthColor')
    .onChange(()=>{
        waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor)
    })

gui.addColor(debugObject, 'surfaceColor')
    .name('SurfaceColor')
    .onChange(()=>{
        waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)
    })


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.setClearColor('#d1dcdf')
renderer.physicallyCorrectLights = true
renderer.toneMapping = THREE.ReinhardToneMapping
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //update uTime
    waterMaterial.uniforms.uTime.value = elapsedTime

    //update stats
    stats.begin();

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    stats.end();


    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()