<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import type { TestResult } from '@/types'
import { driverTypes } from '@/data/questions'
import Earth3D from '@/components/Earth3D.vue'

const router = useRouter()
const result = ref<TestResult | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const isAnimating = ref(false)

let resizeObserver: ResizeObserver | null = null

const classIcons: Record<number, string> = {
  1: '📚',
  2: '⚔️',
  3: '🎮',
  4: '👑',
  5: '🤝',
  6: '🛡️',
  7: '🎨',
  8: '🗺️',
  9: '🏰'
}

onMounted(() => {
  const storedResult = sessionStorage.getItem('testResult')
  if (storedResult) {
    result.value = JSON.parse(storedResult)
    setTimeout(() => {
      isAnimating.value = true
      drawRadar()
      if (canvasRef.value) {
        resizeObserver = new ResizeObserver(() => {
          if (result.value) drawRadar()
        })
        resizeObserver.observe(canvasRef.value)
      }
    }, 500)
  } else {
    router.push('/')
  }
})

onUnmounted(() => {
  if (resizeObserver) resizeObserver.disconnect()
})

const primaryDriverInfo = computed(() => {
  if (!result.value) return null
  return driverTypes.find(d => d.code === result.value!.primaryDriver)
})

const secondaryDriverInfo = computed(() => {
  if (!result.value) return null
  return driverTypes.find(d => d.code === result.value!.secondaryDriver)
})

function drawRadar() {
  if (!canvasRef.value || !result.value) return

  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.scale(dpr, dpr)

  const centerX = rect.width / 2
  const centerY = rect.height / 2
  const size = Math.min(rect.width, rect.height)
  const isSmallScreen = rect.width < 480
  const radius = size * (isSmallScreen ? 0.28 : 0.35)

  ctx.clearRect(0, 0, rect.width, rect.height)

  const drivers = driverTypes
  const angleStep = (Math.PI * 2) / drivers.length

  for (let level = 5; level >= 1; level--) {
    const levelRadius = (radius / 5) * level
    ctx.beginPath()
    for (let i = 0; i < drivers.length; i++) {
      const angle = i * angleStep - Math.PI / 2
      const x = centerX + levelRadius * Math.cos(angle)
      const y = centerY + levelRadius * Math.sin(angle)
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.closePath()
    ctx.strokeStyle = `rgba(96, 165, 250, ${0.08 + level * 0.04})`
    ctx.lineWidth = 1
    ctx.stroke()
  }

  for (let i = 0; i < drivers.length; i++) {
    const angle = i * angleStep - Math.PI / 2
    const x = centerX + radius * Math.cos(angle)
    const y = centerY + radius * Math.sin(angle)
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(x, y)
    ctx.strokeStyle = 'rgba(96, 165, 250, 0.15)'
    ctx.lineWidth = 1
    ctx.stroke()
  }

  ctx.fillStyle = '#93c5fd'
  const labelFontSize = rect.width < 480 ? '12px' : '14px'
  ctx.font = `500 ${labelFontSize} "Noto Sans SC", sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  for (let i = 0; i < drivers.length; i++) {
    const angle = i * angleStep - Math.PI / 2
    const textWidth = ctx.measureText(drivers[i].name).width
    const textHeight = 20
    const labelRadius = isSmallScreen ? radius + 55 : radius + 45
    const labelX = centerX + labelRadius * Math.cos(angle)
    const labelY = centerY + labelRadius * Math.sin(angle)

    let adjustedX = labelX
    let adjustedY = labelY
    const margin = 5
    const halfW = textWidth / 2 + margin

    if (labelX - halfW < 0) adjustedX = halfW
    if (labelX + halfW > rect.width) adjustedX = rect.width - halfW
    if (labelY - textHeight / 2 < 0) adjustedY = textHeight / 2 + margin
    if (labelY + textHeight / 2 > rect.height) adjustedY = rect.height - textHeight / 2 - margin

    ctx.fillText(drivers[i].name, adjustedX, adjustedY)
  }

  ctx.beginPath()
  const scores = drivers.map(d => (result.value!.scores[d.code] || 0) + 1)
  const maxScore = Math.max(...scores, 1)

  for (let i = 0; i < drivers.length; i++) {
    const angle = i * angleStep - Math.PI / 2
    const normalizedScore = (scores[i] / maxScore) * radius
    const x = centerX + normalizedScore * Math.cos(angle)
    const y = centerY + normalizedScore * Math.sin(angle)
    if (i === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  }
  ctx.closePath()

  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
  gradient.addColorStop(0, 'rgba(96, 165, 250, 0.5)')
  gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.3)')
  gradient.addColorStop(1, 'rgba(34, 211, 238, 0.1)')
  ctx.fillStyle = gradient
  ctx.fill()

  ctx.strokeStyle = '#60a5fa'
  ctx.lineWidth = 2
  ctx.stroke()

  for (let i = 0; i < drivers.length; i++) {
    const angle = i * angleStep - Math.PI / 2
    const normalizedScore = (scores[i] / maxScore) * radius
    const x = centerX + normalizedScore * Math.cos(angle)
    const y = centerY + normalizedScore * Math.sin(angle)

    ctx.beginPath()
    ctx.arc(x, y, 4, 0, Math.PI * 2)
    ctx.fillStyle = '#93c5fd'
    ctx.fill()
    ctx.strokeStyle = '#1e3a5f'
    ctx.lineWidth = 2
    ctx.stroke()
  }
}

function restartTest() {
  sessionStorage.removeItem('testResult')
  router.push('/test')
}

function goHome() {
  sessionStorage.removeItem('testResult')
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen relative">
    <Earth3D />
    
    <div class="relative z-10 flex flex-col min-h-screen px-4 py-6 md:py-8">
      <div class="flex justify-between items-center mb-6 md:mb-8">
        <button @click="goHome" class="btn-secondary">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回首页
        </button>
        <button @click="restartTest" class="btn-secondary">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          重新检测
        </button>
      </div>

      <div v-if="result" class="flex-1 flex flex-col items-center">
        <div class="text-center mb-8">
          <div class="mb-4">
            <span class="badge-hud flex items-center gap-2 mx-auto w-fit">
              <span class="pulse-dot"></span>
              ANALYSIS COMPLETE
            </span>
          </div>
          <h1 class="game-title text-3xl md:text-5xl mb-3">
            检测完成
          </h1>
          <p class="text-cyan-300/60" style="font-family:'Orbitron',sans-serif;font-size:0.85rem;letter-spacing:0.1em">
            CLASS ALLOCATION REPORT
          </p>
        </div>

        <div class="hud-panel w-full max-w-xl mb-8 p-4 md:p-6 relative"
             :class="{ 'opacity-0': !isAnimating }"
             style="transition: opacity 0.5s ease">
          <div class="hud-corner tl"></div>
          <div class="hud-corner tr"></div>
          <div class="hud-corner bl"></div>
          <div class="hud-corner br"></div>
          
          <div class="text-center mb-4">
            <span class="data-stream">ATTRIBUTE RADAR</span>
          </div>
          
          <div class="radar-container">
            <canvas ref="canvasRef" class="w-full" style="min-height: 380px; max-height: 480px;"></canvas>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6 w-full max-w-3xl mb-8">
          <div
            v-if="primaryDriverInfo"
            class="class-card primary"
            :class="{ 'opacity-0 translate-y-4': !isAnimating }"
            style="transition: all 0.5s ease 0.2s"
          >
            <div class="hud-corner tl"></div>
            <div class="hud-corner tr"></div>
            <div class="hud-corner bl"></div>
            <div class="hud-corner br"></div>
            
            <div class="flex items-center gap-4 mb-4 relative z-10">
              <div class="class-icon" :style="{ background: `linear-gradient(135deg, ${primaryDriverInfo.color}, ${primaryDriverInfo.color}dd)` }">
                {{ classIcons[primaryDriverInfo.code] }}
              </div>
              <div>
                <div class="data-stream mb-1">PRIMARY CLASS</div>
                <h2 class="text-xl md:text-2xl font-bold text-white" style="font-family:'Noto Sans SC',sans-serif">
                  {{ primaryDriverInfo.name }}
                </h2>
              </div>
            </div>
            <p class="text-blue-300 text-sm mb-3 relative z-10" style="font-family:'Noto Sans SC',sans-serif">
              {{ primaryDriverInfo.description }}
            </p>
            <p class="text-gray-400 text-sm leading-relaxed relative z-10" style="font-family:'Noto Sans SC',sans-serif">
              {{ primaryDriverInfo.detail }}
            </p>
          </div>

          <div
            v-if="secondaryDriverInfo"
            class="class-card secondary"
            :class="{ 'opacity-0 translate-y-4': !isAnimating }"
            style="transition: all 0.5s ease 0.4s"
          >
            <div class="hud-corner tl"></div>
            <div class="hud-corner tr"></div>
            <div class="hud-corner bl"></div>
            <div class="hud-corner br"></div>
            
            <div class="flex items-center gap-4 mb-4 relative z-10">
              <div class="class-icon" :style="{ background: `linear-gradient(135deg, ${secondaryDriverInfo.color}, ${secondaryDriverInfo.color}dd)` }">
                {{ classIcons[secondaryDriverInfo.code] }}
              </div>
              <div>
                <div class="data-stream mb-1">SECONDARY CLASS</div>
                <h2 class="text-xl md:text-2xl font-bold text-white" style="font-family:'Noto Sans SC',sans-serif">
                  {{ secondaryDriverInfo.name }}
                </h2>
              </div>
            </div>
            <p class="text-purple-300 text-sm mb-3 relative z-10" style="font-family:'Noto Sans SC',sans-serif">
              {{ secondaryDriverInfo.description }}
            </p>
            <p class="text-gray-400 text-sm leading-relaxed relative z-10" style="font-family:'Noto Sans SC',sans-serif">
              {{ secondaryDriverInfo.detail }}
            </p>
          </div>
        </div>

        <div
          class="hud-panel w-full max-w-3xl p-5 md:p-6 mb-8 relative"
          :class="{ 'opacity-0': !isAnimating }"
          style="transition: opacity 0.5s ease 0.6s"
        >
          <div class="hud-corner tl"></div>
          <div class="hud-corner tr"></div>
          <div class="hud-corner bl"></div>
          <div class="hud-corner br"></div>
          
          <div class="text-center mb-6">
            <span class="data-stream">ATTRIBUTE BREAKDOWN</span>
          </div>
          
          <div class="space-y-4">
            <div
              v-for="(driver, index) in result.allDrivers"
              :key="driver.code"
              class="flex items-center gap-3"
            >
              <span class="w-3 h-3 rounded-full flex-shrink-0" 
                    :class="index === 0 ? 'bg-blue-400' : index === 1 ? 'bg-purple-400' : 'bg-gray-500'"></span>
              <span class="w-16 md:w-20 text-sm font-medium" 
                    :class="index === 0 ? 'text-blue-300' : index === 1 ? 'text-purple-300' : 'text-gray-400'"
                    style="font-family:'Noto Sans SC',sans-serif">
                {{ driver.name }}
              </span>
              <div class="flex-1 stat-bar">
                <div
                  class="stat-bar-fill"
                  :class="index === 0 ? 'bg-gradient-to-r from-blue-600 to-blue-400' : 
                          index === 1 ? 'bg-gradient-to-r from-purple-600 to-purple-400' : 
                          'bg-gradient-to-r from-gray-600 to-gray-500'"
                  :style="{ width: `${(driver.score / Math.max(...result.allDrivers.map(d => d.score))) * 100}%` }"
                ></div>
              </div>
              <span class="w-6 md:w-8 text-sm text-right font-mono"
                    :class="index === 0 ? 'text-blue-300' : index === 1 ? 'text-purple-300' : 'text-gray-500'">
                {{ driver.score }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 mb-8">
          <button @click="restartTest" class="btn-game">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            重新检测
          </button>
          <button @click="goHome" class="btn-secondary">
            返回首页
          </button>
        </div>

        <div class="text-center">
          <p class="data-stream">EARTH ONLINE v2.0 · ANALYSIS MODULE COMPLETE</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.class-card {
  position: relative;
  padding: 1.25rem;
  background: linear-gradient(135deg, rgba(10, 15, 30, 0.9) 0%, rgba(20, 15, 50, 0.85) 100%);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 12px;
  overflow: hidden;
}

.class-card.primary {
  border-color: rgba(96, 165, 250, 0.5);
  box-shadow: 0 0 30px rgba(59, 130, 246, 0.15);
}

.class-card.secondary {
  border-color: rgba(167, 139, 250, 0.5);
  box-shadow: 0 0 30px rgba(139, 92, 246, 0.15);
}

.radar-container {
  filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.2));
}
</style>
