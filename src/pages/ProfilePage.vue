<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import type { TestResult, AttributeResult } from '@/types'
import { driverTypes } from '@/data/questions'
import { attributeTypes } from '@/data/attributes'
import Earth3D from '@/components/Earth3D.vue'

const router = useRouter()
const result = ref<TestResult | null>(null)
const attributeResult = ref<AttributeResult | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const isAnimating = ref(false)
const hasResult = ref(false)
const hasAttributeResult = ref(false)

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  const storedResult = localStorage.getItem('testResult')
  const userData = localStorage.getItem('userData')
  
  if (storedResult) {
    result.value = JSON.parse(storedResult)
    hasResult.value = true
  }
  
  if (userData) {
    const parsed = JSON.parse(userData)
    if (parsed.attributeResult) {
      attributeResult.value = parsed.attributeResult
      hasAttributeResult.value = true
    }
  }
  
  setTimeout(() => {
    isAnimating.value = true
    if (result.value) {
      drawRadar()
    }
    if (canvasRef.value) {
      resizeObserver = new ResizeObserver(() => {
        if (result.value) drawRadar()
      })
      resizeObserver.observe(canvasRef.value)
    }
  }, 500)
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

const playerStats = computed(() => {
  if (!result.value) return []
  
  return driverTypes.map(driver => {
    const score = result.value!.scores[driver.code] || 0
    const maxScore = Math.max(...Object.values(result.value!.scores))
    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0
    
    let rank = 'F'
    if (score >= 5) rank = 'S'
    else if (score >= 4) rank = 'A'
    else if (score >= 3) rank = 'B'
    else if (score >= 2) rank = 'C'
    else if (score >= 1) rank = 'D'
    
    return {
      ...driver,
      score,
      percentage,
      rank,
      isPrimary: driver.code === result.value!.primaryDriver,
      isSecondary: driver.code === result.value!.secondaryDriver
    }
  }).sort((a, b) => b.score - a.score)
})

const playerLevel = computed(() => {
  if (!result.value) return 1
  const totalScore = Object.values(result.value.scores).reduce((sum, s) => sum + s, 0)
  return Math.min(100, Math.floor(totalScore * 1.5) + 1)
})

const expPercentage = computed(() => {
  const exp = playerLevel.value * 25
  return exp % 100
})

const playerTitle = computed(() => {
  if (playerLevel.value >= 80) return '传奇玩家'
  if (playerLevel.value >= 60) return '精英玩家'
  if (playerLevel.value >= 40) return '资深玩家'
  if (playerLevel.value >= 20) return '进阶玩家'
  return '新手玩家'
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

function takeTest() {
  router.push('/test/intro')
}

function goToAttributeTest() {
  router.push('/attribute-test')
}

function goHome() {
  router.push('/')
}

const rankColors: Record<string, string> = {
  'S': 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
  'A': 'text-purple-400 bg-purple-500/20 border-purple-500/30',
  'B': 'text-blue-400 bg-blue-500/20 border-blue-500/30',
  'C': 'text-green-400 bg-green-500/20 border-green-500/30',
  'D': 'text-gray-400 bg-gray-500/20 border-gray-500/30',
  'F': 'text-red-400 bg-red-500/20 border-red-500/30'
}

const rankBars: Record<string, string> = {
  'S': 'bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600',
  'A': 'bg-gradient-to-r from-purple-600 via-purple-400 to-purple-600',
  'B': 'bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600',
  'C': 'bg-gradient-to-r from-green-600 via-green-400 to-green-600',
  'D': 'bg-gradient-to-r from-gray-600 via-gray-400 to-gray-600',
  'F': 'bg-gradient-to-r from-red-600 via-red-400 to-red-600'
}
</script>

<template>
  <div class="min-h-screen relative">
    <Earth3D />
    
    <div class="relative z-10 min-h-screen flex flex-col px-4 py-6">
      <div class="flex justify-between items-center mb-6">
        <button @click="goHome" class="back-btn flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-500/30 bg-blue-900/20 text-blue-300 hover:bg-blue-900/40 transition-all">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回大厅
        </button>
        <h1 class="text-2xl font-bold text-cyan-300" style="font-family:'Orbitron',sans-serif">
          属性面板
        </h1>
        <button @click="takeTest" class="btn-secondary flex items-center gap-2 px-4 py-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ hasResult ? '重新测试' : '开始测试' }}
        </button>
      </div>

      <div v-if="result" class="flex-1 flex flex-col gap-6 max-w-5xl mx-auto w-full">
        <div class="hud-panel p-4 md:p-6 relative" :class="{ 'opacity-0': !isAnimating }" style="transition: opacity 0.5s ease">
          <div class="hud-corner tl"></div>
          <div class="hud-corner tr"></div>
          <div class="hud-corner bl"></div>
          <div class="hud-corner br"></div>
          
          <div class="flex flex-col md:flex-row items-center gap-6">
            <div class="avatar-container">
              <div class="avatar-ring"></div>
              <div class="avatar" :style="{ background: `linear-gradient(135deg, ${primaryDriverInfo?.color || '#3b82f6'}, ${secondaryDriverInfo?.color || '#8b5cf6'})` }">
                {{ primaryDriverInfo?.name.charAt(0) || '?' }}
              </div>
              <div class="level-badge">Lv.{{ playerLevel }}</div>
            </div>
            
            <div class="flex-1 text-center md:text-left">
              <div class="flex items-center gap-2 justify-center md:justify-start mb-2">
                <span class="data-stream">PLAYER PROFILE</span>
                <span class="px-2 py-0.5 text-xs rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                  {{ playerTitle }}
                </span>
              </div>
              
              <h2 class="text-xl md:text-2xl font-bold mb-3" style="font-family:'Noto Sans SC',sans-serif">
                {{ primaryDriverInfo?.name || '未知' }} · {{ secondaryDriverInfo?.name || '未知' }}
              </h2>
              
              <div class="exp-bar-container">
                <div class="exp-bar-label flex justify-between text-xs mb-1">
                  <span class="text-blue-300">经验值</span>
                  <span class="text-blue-300">{{ expPercentage }}%</span>
                </div>
                <div class="exp-bar-bg">
                  <div class="exp-bar-fill" :style="{ width: expPercentage + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div class="hud-panel p-4 md:p-6 relative" :class="{ 'opacity-0': !isAnimating }" style="transition: opacity 0.5s ease 0.2s">
            <div class="hud-corner tl"></div>
            <div class="hud-corner tr"></div>
            <div class="hud-corner bl"></div>
            <div class="hud-corner br"></div>
            
            <div class="text-center mb-4">
              <span class="data-stream">CLASS TENDENCY</span>
              <h3 class="text-lg font-bold text-cyan-300 mt-1">职业趋向图</h3>
            </div>
            
            <div class="radar-container">
              <canvas ref="canvasRef" class="w-full" style="min-height: 300px; max-height: 400px;"></canvas>
            </div>
          </div>

          <div class="hud-panel p-4 md:p-6 relative" :class="{ 'opacity-0': !isAnimating }" style="transition: opacity 0.5s ease 0.4s">
            <div class="hud-corner tl"></div>
            <div class="hud-corner tr"></div>
            <div class="hud-corner bl"></div>
            <div class="hud-corner br"></div>
            
            <div class="text-center mb-4">
              <span class="data-stream">CLASS ASSIGNMENT</span>
              <h3 class="text-lg font-bold text-cyan-300 mt-1">职业分配</h3>
            </div>
            
            <div class="space-y-4">
              <div class="class-slot primary">
                <div class="slot-label">主职业</div>
                <div class="slot-content">
                  <div class="class-icon" :style="{ background: `linear-gradient(135deg, ${primaryDriverInfo?.color || '#3b82f6'}, ${primaryDriverInfo?.color + 'dd' || '#3b82f6'})` }">
                    {{ primaryDriverInfo?.name.charAt(0) || '?' }}
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2">
                      <h4 class="text-lg font-bold text-white">{{ primaryDriverInfo?.name || '未知' }}</h4>
                      <span class="rank-badge" :class="rankColors['S']">S</span>
                    </div>
                    <p class="text-sm text-blue-300/70 mt-1">{{ primaryDriverInfo?.description }}</p>
                  </div>
                </div>
              </div>
              
              <div class="class-slot secondary">
                <div class="slot-label">副职业</div>
                <div class="slot-content">
                  <div class="class-icon" :style="{ background: `linear-gradient(135deg, ${secondaryDriverInfo?.color || '#8b5cf6'}, ${secondaryDriverInfo?.color + 'dd' || '#8b5cf6'})` }">
                    {{ secondaryDriverInfo?.name.charAt(0) || '?' }}
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2">
                      <h4 class="text-lg font-bold text-white">{{ secondaryDriverInfo?.name || '未知' }}</h4>
                      <span class="rank-badge" :class="rankColors['A']">A</span>
                    </div>
                    <p class="text-sm text-purple-300/70 mt-1">{{ secondaryDriverInfo?.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="hasAttributeResult && attributeResult" 
             class="hud-panel p-4 md:p-6 relative" 
             :class="{ 'opacity-0': !isAnimating }" 
             style="transition: opacity 0.5s ease 0.6s">
          <div class="hud-corner tl"></div>
          <div class="hud-corner tr"></div>
          <div class="hud-corner bl"></div>
          <div class="hud-corner br"></div>
          
          <div class="text-center mb-4">
            <span class="data-stream">ATTRIBUTE VALUES</span>
            <h3 class="text-lg font-bold text-cyan-300 mt-1">属性值</h3>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div
              v-for="attr in attributeResult.allAttributes"
              :key="attr.code"
              class="attribute-item"
            >
              <div class="attr-icon" :style="{ background: attributeTypes.find(a => a.code === attr.code)?.color + '30', borderColor: attributeTypes.find(a => a.code === attr.code)?.color }">
                {{ attributeTypes.find(a => a.code === attr.code)?.icon }}
              </div>
              <div class="attr-info">
                <span class="attr-name" :style="{ color: attributeTypes.find(a => a.code === attr.code)?.color }">{{ attr.name }}</span>
                <span class="attr-score">{{ attr.score }}</span>
              </div>
              <div class="attr-bar">
                <div 
                  class="attr-bar-fill" 
                  :style="{ 
                    width: (attr.score / attributeResult.allAttributes[0].score * 100) + '%',
                    background: `linear-gradient(90deg, ${attributeTypes.find(a => a.code === attr.code)?.color}, ${attributeTypes.find(a => a.code === attr.code)?.color}aa)`
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="!hasAttributeResult" 
             class="hud-panel p-4 md:p-6 relative"
             style="transition: opacity 0.5s ease 0.6s">
          <div class="hud-corner tl"></div>
          <div class="hud-corner tr"></div>
          <div class="hud-corner bl"></div>
          <div class="hud-corner br"></div>
          <div class="text-center py-4">
            <p class="text-gray-400 mb-4">尚未完成属性值测试</p>
            <button @click="goToAttributeTest" class="btn-secondary">
              开始属性值测试
            </button>
          </div>
        </div>

        <div class="text-center py-4">
          <p class="data-stream">EARTH ONLINE · PLAYER PROFILE SYSTEM v1.0</p>
        </div>
      </div>

      <div v-else class="flex-1 flex items-center justify-center">
        <div class="empty-state hud-panel p-8 md:p-12 text-center max-w-lg mx-auto">
          <div class="hud-corner tl"></div>
          <div class="hud-corner tr"></div>
          <div class="hud-corner bl"></div>
          <div class="hud-corner br"></div>
          
          <div class="empty-icon mb-6">
            <svg class="w-20 h-20 mx-auto text-blue-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          
          <h2 class="text-2xl font-bold text-cyan-300 mb-4" style="font-family:'Noto Sans SC',sans-serif">
            属性面板为空
          </h2>
          
          <p class="text-blue-200/70 mb-6" style="font-family:'Noto Sans SC',sans-serif">
            您还未完成职业测试，属性面板暂无数据。
            <br />
            完成测试后，即可查看您的完整属性信息。
          </p>
          
          <button @click="takeTest" class="btn-game text-lg px-8 py-4">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            立即开始测试
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.avatar-container {
  position: relative;
  width: 100px;
  height: 100px;
  flex-shrink: 0;
}

.avatar-ring {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4);
  animation: spin 3s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.avatar {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  color: white;
  border: 3px solid #0f172a;
  z-index: 1;
}

.level-badge {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  color: white;
  padding: 2px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: bold;
  z-index: 2;
  border: 2px solid #0f172a;
}

.exp-bar-bg {
  height: 8px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  overflow: hidden;
}

.exp-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6);
  border-radius: 4px;
  transition: width 1s ease;
}

.radar-container {
  filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.2));
}

.class-slot {
  padding: 16px;
  border-radius: 12px;
  border: 1px solid;
}

.class-slot.primary {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%);
  border-color: rgba(96, 165, 250, 0.4);
}

.class-slot.secondary {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%);
  border-color: rgba(167, 139, 250, 0.4);
}

.slot-label {
  font-size: 0.7rem;
  color: #64748b;
  margin-bottom: 8px;
  letter-spacing: 0.1em;
}

.slot-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.class-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: bold;
  color: white;
  flex-shrink: 0;
}

.rank-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
  border: 1px solid;
}

.stat-card {
  padding: 12px 16px;
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(59, 130, 246, 0.2);
  transition: all 0.3s ease;
}

.stat-card:hover {
  border-color: rgba(96, 165, 250, 0.4);
  background: rgba(15, 23, 42, 0.8);
}

.stat-card.highlight {
  border-color: rgba(250, 204, 21, 0.4);
  background: rgba(250, 204, 21, 0.1);
}

.stat-card.secondary-highlight {
  border-color: rgba(167, 139, 250, 0.4);
  background: rgba(139, 92, 246, 0.1);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.stat-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border: 2px solid;
  flex-shrink: 0;
}

.stat-bar-bg {
  height: 6px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  overflow: hidden;
}

.stat-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 1s ease;
}

.empty-state {
  position: relative;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(96, 165, 250, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.empty-state:hover {
  border-color: rgba(96, 165, 250, 0.4);
}

.empty-icon {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

.attribute-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: rgba(15, 23, 42, 0.6);
  border-radius: 8px;
  border: 1px solid rgba(96, 165, 250, 0.2);
}

.attr-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  border: 1px solid;
}

.attr-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.attr-name {
  font-weight: bold;
  font-size: 0.875rem;
}

.attr-score {
  font-size: 0.75rem;
  color: #94a3b8;
}

.attr-bar {
  height: 4px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 2px;
  overflow: hidden;
}

.attr-bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 1s ease;
}
</style>
