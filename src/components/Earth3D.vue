<template>
  <div class="earth-bg-container">
    <canvas ref="canvasRef" class="earth-canvas"></canvas>
    <div v-if="!threeReady" class="css-earth-fallback">
      <div class="earth-sphere">
        <div class="earth-surface"></div>
        <div class="earth-atmosphere"></div>
        <div class="earth-clouds"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const threeReady = ref(false)

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let earth: THREE.Mesh
let clouds: THREE.Mesh
let stars: THREE.Points
let atmosphere: THREE.Mesh
let atmosphereMaterial: THREE.ShaderMaterial
let animationId: number
let time = 0

onMounted(() => {
  init()
  animate()
})

onUnmounted(() => {
  cleanup()
})

function createEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 1024
  const ctx = canvas.getContext('2d')!

  const oceanGradient = ctx.createLinearGradient(0, 0, 0, 1024)
  oceanGradient.addColorStop(0, '#0d2137')
  oceanGradient.addColorStop(0.3, '#1a3a5c')
  oceanGradient.addColorStop(0.5, '#0f2b4a')
  oceanGradient.addColorStop(0.7, '#1a3a5c')
  oceanGradient.addColorStop(1, '#0d2137')
  ctx.fillStyle = oceanGradient
  ctx.fillRect(0, 0, 2048, 1024)

  const continents = [
    { x: 180, y: 200, w: 350, h: 200, shape: 'irregular' },
    { x: 250, y: 300, w: 200, h: 300, shape: 'elongated' },
    { x: 300, y: 500, w: 280, h: 180, shape: 'wide' },
    { x: 600, y: 180, w: 500, h: 100, shape: 'long' },
    { x: 700, y: 250, w: 150, h: 250, shape: 'vertical' },
    { x: 900, y: 400, w: 400, h: 250, shape: 'irregular' },
    { x: 1100, y: 200, w: 300, h: 180, shape: 'rounded' },
    { x: 1400, y: 350, w: 350, h: 300, shape: 'irregular' },
    { x: 1700, y: 450, w: 250, h: 200, shape: 'rounded' },
    { x: 100, y: 650, w: 200, h: 150, shape: 'wide' },
    { x: 800, y: 700, w: 100, h: 200, shape: 'long' },
    { x: 1500, y: 650, w: 350, h: 120, shape: 'wide' },
    { x: 400, y: 850, w: 800, h: 80, shape: 'long' },
    { x: 1200, y: 880, w: 600, h: 60, shape: 'long' },
  ]

  continents.forEach(c => {
    const green = 40 + Math.floor(Math.random() * 30)
    const ctx2 = 80 + Math.floor(Math.random() * 40)
    const blend = Math.random()
    let landColor: string
    if (blend < 0.4) {
      landColor = `rgb(${green + 30}, ${ctx2 + 20}, ${green})`
    } else if (blend < 0.7) {
      landColor = `rgb(${green}, ${ctx2 + 30}, ${green + 20})`
    } else {
      landColor = `rgb(${green + 50}, ${ctx2}, ${green})`
    }
    ctx.fillStyle = landColor

    ctx.beginPath()
    const points = 8 + Math.floor(Math.random() * 6)
    for (let i = 0; i < points; i++) {
      const angle = (i / points) * Math.PI * 2
      const variability = 0.7 + Math.random() * 0.6
      const px = c.x + (c.w / 2) * Math.cos(angle) * variability
      const py = c.y + (c.h / 2) * Math.sin(angle) * variability
      if (i === 0) {
        ctx.moveTo(px, py)
      } else {
        ctx.lineTo(px, py)
      }
    }
    ctx.closePath()
    ctx.fill()

    ctx.strokeStyle = `rgba(${green + 40}, ${ctx2 + 30}, ${green + 20}, 0.3)`
    ctx.lineWidth = 2
    ctx.stroke()

    if (Math.random() > 0.5) {
      ctx.fillStyle = `rgba(${green + 80}, ${ctx2 + 60}, ${green + 40}, 0.4)`
      const offsetX = (Math.random() - 0.5) * c.w * 0.4
      const offsetY = (Math.random() - 0.5) * c.h * 0.4
      ctx.beginPath()
      ctx.ellipse(c.x + c.w / 2 + offsetX, c.y + c.h / 2 + offsetY, c.w * 0.15, c.h * 0.1, Math.random() * Math.PI, 0, Math.PI * 2)
      ctx.fill()
    }
  })

  for (let i = 0; i < 60; i++) {
    const x = Math.random() * 2048
    const y = 880 + Math.random() * 100
    ctx.fillStyle = `rgba(220, 230, 240, ${0.3 + Math.random() * 0.4})`
    ctx.beginPath()
    ctx.ellipse(x, y, 20 + Math.random() * 60, 5 + Math.random() * 15, Math.random() * Math.PI, 0, Math.PI * 2)
    ctx.fill()
  }

  for (let i = 0; i < 40; i++) {
    const x = Math.random() * 2048
    const y = Math.random() * 80
    ctx.fillStyle = `rgba(220, 230, 240, ${0.4 + Math.random() * 0.3})`
    ctx.beginPath()
    ctx.ellipse(x, y, 30 + Math.random() * 80, 8 + Math.random() * 20, Math.random() * Math.PI, 0, Math.PI * 2)
    ctx.fill()
  }

  const iceGradient1 = ctx.createLinearGradient(0, 0, 0, 60)
  iceGradient1.addColorStop(0, 'rgba(240, 248, 255, 0.9)')
  iceGradient1.addColorStop(1, 'rgba(240, 248, 255, 0)')
  ctx.fillStyle = iceGradient1
  ctx.fillRect(0, 0, 2048, 60)

  const iceGradient2 = ctx.createLinearGradient(0, 960, 0, 1024)
  iceGradient2.addColorStop(0, 'rgba(240, 248, 255, 0)')
  iceGradient2.addColorStop(1, 'rgba(240, 248, 255, 0.9)')
  ctx.fillStyle = iceGradient2
  ctx.fillRect(0, 960, 2048, 64)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function createCloudTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 1024
  const ctx = canvas.getContext('2d')!

  ctx.clearRect(0, 0, 2048, 1024)

  for (let i = 0; i < 100; i++) {
    const x = Math.random() * 2048
    const y = Math.random() * 1024
    const size = 40 + Math.random() * 120
    const alpha = 0.1 + Math.random() * 0.25
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
    ctx.beginPath()
    ctx.ellipse(x, y, size, size * 0.4, Math.random() * Math.PI, 0, Math.PI * 2)
    ctx.fill()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function init() {
  if (!canvasRef.value) return

  const container = canvasRef.value.parentElement
  if (!container) return

  const width = window.innerWidth
  const height = window.innerHeight

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
  camera.position.z = 3

  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0)

  const earthGeometry = new THREE.SphereGeometry(1, 64, 64)
  const earthTexture = createEarthTexture()

  const earthMaterial = new THREE.MeshPhongMaterial({
    map: earthTexture,
    shininess: 15,
    specular: new THREE.Color(0x222233),
    transparent: true
  })

  earth = new THREE.Mesh(earthGeometry, earthMaterial)
  scene.add(earth)

  const cloudsGeometry = new THREE.SphereGeometry(1.02, 64, 64)
  const cloudsTexture = createCloudTexture()

  const cloudsMaterial = new THREE.MeshPhongMaterial({
    map: cloudsTexture,
    transparent: true,
    opacity: 0.4,
    depthWrite: false
  })

  clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial)
  scene.add(clouds)

  const atmosphereGeometry = new THREE.SphereGeometry(1.15, 64, 64)
atmosphereMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 }
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float uTime;
    
    vec3 getAtmosphereColor(float time) {
      vec3 blue = vec3(0.3, 0.6, 1.0);
      vec3 purple = vec3(0.5, 0.3, 0.9);
      vec3 cyan = vec3(0.2, 0.8, 0.9);
      vec3 teal = vec3(0.1, 0.6, 0.7);
      
      float phase1 = sin(time * 0.3) * 0.5 + 0.5;
      float phase2 = sin(time * 0.3 + 2.0) * 0.5 + 0.5;
      
      vec3 color1 = mix(blue, purple, phase1);
      vec3 color2 = mix(cyan, teal, phase2);
      
      return mix(color1, color2, sin(time * 0.2) * 0.5 + 0.5);
    }
    
    void main() {
      vec3 viewDirection = normalize(-vPosition);
      float intensity = pow(0.65 - dot(vNormal, viewDirection), 3.0);
      vec3 atmosphereColor = getAtmosphereColor(uTime);
      float pulse = sin(uTime * 0.5) * 0.1 + 0.9;
      gl_FragColor = vec4(atmosphereColor, 1.0) * intensity * pulse;
    }
  `,
  blending: THREE.AdditiveBlending,
  side: THREE.BackSide,
  transparent: true,
  depthWrite: false
})

atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
scene.add(atmosphere)

  const ambientLight = new THREE.AmbientLight(0x1a1a2e, 0.6)
  scene.add(ambientLight)

  const sunLight = new THREE.DirectionalLight(0xfff5e0, 1.2)
  sunLight.position.set(5, 3, 5)
  scene.add(sunLight)

  const fillLight = new THREE.DirectionalLight(0x4466aa, 0.4)
  fillLight.position.set(-5, -2, -3)
  scene.add(fillLight)

  const starsGeometry = new THREE.BufferGeometry()
  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.015,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true
  })

  const starsVertices: number[] = []
  for (let i = 0; i < 3000; i++) {
    const r = 50 + Math.random() * 100
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    starsVertices.push(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    )
  }

  starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3))
  stars = new THREE.Points(starsGeometry, starsMaterial)
  scene.add(stars)

  threeReady.value = true
  window.addEventListener('resize', onWindowResize)
}

function onWindowResize() {
  const width = window.innerWidth
  const height = window.innerHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

function animate() {
  animationId = requestAnimationFrame(animate)
  time += 0.016
  
  if (atmosphereMaterial) {
    atmosphereMaterial.uniforms.uTime.value = time
  }
  
  if (earth) {
    earth.rotation.y += 0.0015
  }
  if (clouds) {
    clouds.rotation.y += 0.002
  }
  if (atmosphere) {
    atmosphere.rotation.y += 0.0012
  }
  if (stars) {
    stars.rotation.y += 0.0001
  }
  
  renderer.render(scene, camera)
}

function cleanup() {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', onWindowResize)
  
  if (renderer) {
    renderer.dispose()
    if (canvasRef.value && renderer.domElement) {
      canvasRef.value.removeChild(renderer.domElement)
    }
  }
}
</script>

<style scoped>
.earth-bg-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.earth-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.css-earth-fallback {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80vmin;
  height: 80vmin;
}

.earth-sphere {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  animation: earth-rotate 60s linear infinite;
  transform-style: preserve-3d;
}

.earth-surface {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: 
    radial-gradient(circle at 30% 30%, #2d5a87 0%, #1a3a5c 40%, #0d2137 100%);
  box-shadow: 
    inset -30px -30px 80px rgba(0, 0, 0, 0.6),
    inset 10px 10px 40px rgba(100, 150, 200, 0.2);
}

.earth-surface::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: 
    radial-gradient(ellipse at 20% 40%, rgba(80, 130, 80, 0.4) 0%, transparent 30%),
    radial-gradient(ellipse at 60% 30%, rgba(60, 110, 60, 0.3) 0%, transparent 25%),
    radial-gradient(ellipse at 40% 60%, rgba(70, 120, 70, 0.35) 0%, transparent 28%),
    radial-gradient(ellipse at 75% 65%, rgba(50, 100, 50, 0.3) 0%, transparent 22%),
    radial-gradient(ellipse at 30% 80%, rgba(200, 210, 220, 0.4) 0%, transparent 35%),
    radial-gradient(ellipse at 30% 15%, rgba(200, 210, 220, 0.35) 0%, transparent 30%);
}

.earth-clouds {
  position: absolute;
  width: 104%;
  height: 104%;
  top: -2%;
  left: -2%;
  border-radius: 50%;
  background: 
    radial-gradient(ellipse at 25% 35%, rgba(255, 255, 255, 0.25) 0%, transparent 8%),
    radial-gradient(ellipse at 55% 45%, rgba(255, 255, 255, 0.2) 0%, transparent 6%),
    radial-gradient(ellipse at 70% 25%, rgba(255, 255, 255, 0.22) 0%, transparent 7%),
    radial-gradient(ellipse at 40% 65%, rgba(255, 255, 255, 0.18) 0%, transparent 5%),
    radial-gradient(ellipse at 80% 70%, rgba(255, 255, 255, 0.2) 0%, transparent 6%),
    radial-gradient(ellipse at 15% 75%, rgba(255, 255, 255, 0.15) 0%, transparent 5%);
  animation: cloud-rotate 45s linear infinite;
}

.earth-atmosphere {
  position: absolute;
  width: 115%;
  height: 115%;
  top: -7.5%;
  left: -7.5%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(100, 180, 255, 0) 60%,
    rgba(100, 180, 255, 0.1) 65%,
    rgba(80, 160, 255, 0.2) 75%,
    rgba(60, 140, 255, 0.1) 85%,
    rgba(40, 120, 255, 0) 100%
  );
  filter: blur(10px);
  animation: atmosphere-pulse 8s ease-in-out infinite;
}

@keyframes earth-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes cloud-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
}

@keyframes atmosphere-pulse {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}
</style>
