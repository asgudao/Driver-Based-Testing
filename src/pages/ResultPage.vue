<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { TestResult } from '@/types'
import { driverTypes } from '@/data/questions'

const router = useRouter()
const result = ref<TestResult | null>(null)
const stars = ref<Array<{ id: number, left: string, top: string, size: string, delay: string }>>([])
const canvasRef = ref<HTMLCanvasElement | null>(null)
const isAnimating = ref(false)

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  for (let i = 0; i < 50; i++) {
    stars.value.push({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      delay: `${Math.random() * 3}s`
    })
  }

  const storedResult = sessionStorage.getItem('testResult')
  if (storedResult) {
    result.value = JSON.parse(storedResult)
    setTimeout(() => {
      isAnimating.value = true
      drawRadar()

      if (canvasRef.value) {
        resizeObserver = new ResizeObserver(() => {
          if (result.value) {
            drawRadar()
          }
        })
        resizeObserver.observe(canvasRef.value)
      }
    }, 500)
  } else {
    router.push('/')
  }
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})

watch(result, () => {
  if (result.value) {
    drawRadar()
  }
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
    ctx.strokeStyle = `rgba(244, 208, 63, ${0.1 + level * 0.05})`
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
    ctx.strokeStyle = 'rgba(244, 208, 63, 0.2)'
    ctx.lineWidth = 1
    ctx.stroke()
  }

  ctx.fillStyle = '#f4d03f'
  const labelFontSize = rect.width < 480 ? '12px' : '13px'
  ctx.font = `${labelFontSize} Inter, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  for (let i = 0; i < drivers.length; i++) {
    const angle = i * angleStep - Math.PI / 2
    const textWidth = ctx.measureText(drivers[i].name).width
    const textHeight = 20
    const isSmallScreen = rect.width < 480
    const baseMargin = isSmallScreen ? 35 : 25
    const minLabelRadius = radius + Math.max(textWidth, textHeight) / 2 + baseMargin
    const defaultLabelRadius = isSmallScreen ? radius + 65 : radius + 55
    const labelRadius = Math.max(defaultLabelRadius, minLabelRadius)
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
  const scores = drivers.map(d => result.value!.scores[d.code] || 0)
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
  gradient.addColorStop(0, 'rgba(244, 208, 63, 0.6)')
  gradient.addColorStop(1, 'rgba(244, 208, 63, 0.1)')
  ctx.fillStyle = gradient
  ctx.fill()

  ctx.strokeStyle = '#f4d03f'
  ctx.lineWidth = 1
  ctx.stroke()

  for (let i = 0; i < drivers.length; i++) {
    const angle = i * angleStep - Math.PI / 2
    const normalizedScore = (scores[i] / maxScore) * radius
    const x = centerX + normalizedScore * Math.cos(angle)
    const y = centerY + normalizedScore * Math.sin(angle)

    ctx.beginPath()
    ctx.arc(x, y, 2.5, 0, Math.PI * 2)
    ctx.fillStyle = '#f4d03f'
    ctx.fill()
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 1
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
  <div class="relative min-h-screen overflow-hidden mystic-bg">
    <div class="absolute inset-0">
      <div
        v-for="star in stars"
        :key="star.id"
        class="star"
        :style="{
          left: star.left,
          top: star.top,
          width: star.size,
          height: star.size,
          animationDelay: star.delay
        }"
      ></div>
    </div>

    <div class="relative z-10 flex flex-col min-h-screen px-4 py-8">
      <div class="flex justify-between items-center mb-8">
        <button @click="goHome" class="btn-mystic">← 返回首页</button>
        <button @click="restartTest" class="btn-mystic">重新测试</button>
      </div>

      <div v-if="result" class="flex-1 flex flex-col items-center">
        <h1
          class="text-3xl md:text-4xl font-serif mb-2 tracking-wider"
          style="background: linear-gradient(135deg, #b8901a 0%, #f4d03f 40%, #fff8dc 50%, #f4d03f 60%, #b8901a 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 0 20px rgba(244, 208, 63, 0.3));"
        >
          测试结果
        </h1>
        <p class="text-gold-400/60 mb-8 tracking-wide">探索你的内在驱动力</p>

        <!-- 雷达图 -->
        <div
          class="w-full max-w-xl mb-10 p-4"
          :class="{ 'opacity-0': !isAnimating }"
          style="transition: opacity 0.5s ease"
        >
          <canvas ref="canvasRef" class="w-full" style="min-height: 480px; max-height: 550px;"></canvas>
        </div>

        <!-- 主要驱动 -->
        <div
          v-if="primaryDriverInfo"
          class="card-gold-frame w-full max-w-2xl mb-6"
          :class="{ 'opacity-0 translate-y-4': !isAnimating }"
          style="transition: all 0.5s ease 0.2s"
        >
          <div class="flex items-center gap-4 mb-4">
            <div
              class="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-gold-400 border border-gold-500/50 leading-none"
            >主</div>
            <div>
              <h2 class="text-xl font-bold text-white">{{ primaryDriverInfo.name }}驱动型</h2>
              <p class="text-gold-400">{{ primaryDriverInfo.description }}</p>
            </div>
          </div>
          <p class="text-gray-300 leading-relaxed">{{ primaryDriverInfo.detail }}</p>
        </div>

        <!-- 次要驱动 -->
        <div
          v-if="secondaryDriverInfo"
          class="card-gold-frame w-full max-w-2xl mb-8"
          :class="{ 'opacity-0 translate-y-4': !isAnimating }"
          style="transition: all 0.5s ease 0.4s"
        >
          <div class="flex items-center gap-4 mb-4">
            <div
              class="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-gold-400 border border-gold-500/50 leading-none"
            >次</div>
            <div>
              <h2 class="text-xl font-bold text-white">{{ secondaryDriverInfo.name }}驱动型</h2>
              <p class="text-gold-400/70">{{ secondaryDriverInfo.description }}</p>
            </div>
          </div>
          <p class="text-gray-300 leading-relaxed">{{ secondaryDriverInfo.detail }}</p>
        </div>

        <!-- 各维度得分 -->
        <div
          class="w-full max-w-2xl mb-8 card-mystic p-6"
          :class="{ 'opacity-0': !isAnimating }"
          style="transition: opacity 0.5s ease 0.6s"
        >
          <h3 class="text-lg font-serif text-gold-400 mb-4 gold-pattern py-2">各维度得分</h3>
          <div class="space-y-3">
            <div
              v-for="driver in result.allDrivers"
              :key="driver.code"
              class="flex items-center gap-2 md:gap-3"
            >
              <span class="w-14 md:w-20 text-sm text-gray-400 shrink-0">{{ driver.name }}</span>
              <div class="flex-1 h-2 bg-gray-800/50 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-700"
                  :style="{
                    width: `${(driver.score / Math.max(...result.allDrivers.map(d => d.score))) * 100}%`,
                    background: 'linear-gradient(to right, rgba(184, 144, 26, 0.5), #f4d03f)'
                  }"
                ></div>
              </div>
              <span class="w-6 md:w-8 text-sm text-gray-400 text-right shrink-0">{{ driver.score }}</span>
            </div>
          </div>
        </div>

        <div class="flex gap-4">
          <button @click="restartTest" class="btn-gold">重新测试</button>
          <button @click="goHome" class="btn-mystic">返回首页</button>
        </div>
      </div>
    </div>
  </div>
</template>
