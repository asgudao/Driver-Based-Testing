<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { AttributeResult } from '@/types'
import { attributeTypes } from '@/data/attributes'
import Earth3D from '@/components/Earth3D.vue'

const router = useRouter()
const result = ref<AttributeResult | null>(null)
const isAnimating = ref(false)

onMounted(() => {
  const userData = localStorage.getItem('userData')
  if (userData) {
    const parsed = JSON.parse(userData)
    if (parsed.attributeResult) {
      result.value = parsed.attributeResult
    }
  }
  
  setTimeout(() => {
    isAnimating.value = true
  }, 100)
})

const maxAttributeInfo = () => {
  if (!result.value) return null
  return attributeTypes.find(a => a.code === result.value!.maxAttribute)
}

const getAttributeInfo = (code: number) => {
  return attributeTypes.find(a => a.code === code)
}

function retakeTest() {
  router.push('/attribute-test')
}

function goHome() {
  router.push('/')
}

function goToProfile() {
  router.push('/profile')
}
</script>

<template>
  <div class="min-h-screen relative">
    <Earth3D />
    
    <div class="relative z-10 min-h-screen flex flex-col px-4 py-6">
      <div class="flex justify-between items-center mb-6">
        <button @click="goHome" class="btn-secondary flex items-center gap-2 px-4 py-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回首页
        </button>
        <button @click="retakeTest" class="btn-secondary flex items-center gap-2 px-4 py-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          重新测试
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
            属性分析完成
          </h1>
          <p class="text-cyan-300/60" style="font-family:'Orbitron',sans-serif;font-size:0.85rem;letter-spacing:0.1em">
            ATTRIBUTE ANALYSIS REPORT
          </p>
        </div>
        
        <div 
          class="hud-panel w-full max-w-2xl p-6 mb-8 relative"
          :class="{ 'opacity-0 translate-y-4': !isAnimating }"
          style="transition: all 0.5s ease 0.1s"
        >
          <div class="hud-corner tl"></div>
          <div class="hud-corner tr"></div>
          <div class="hud-corner bl"></div>
          <div class="hud-corner br"></div>
          
          <div class="text-center mb-6">
            <span class="data-stream">DOMINANT ATTRIBUTE</span>
          </div>
          
          <div v-if="maxAttributeInfo()" class="flex flex-col items-center">
            <div 
              class="w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-4"
              :style="{ background: `linear-gradient(135deg, ${maxAttributeInfo()!.color}, ${maxAttributeInfo()!.color}88)` }"
            >
              {{ maxAttributeInfo()!.icon }}
            </div>
            <h2 class="text-2xl md:text-3xl font-bold text-white mb-2" style="font-family:'Noto Sans SC',sans-serif">
              {{ maxAttributeInfo()!.name }}
            </h2>
            <p class="text-gray-400 text-center" style="font-family:'Noto Sans SC',sans-serif">
              {{ maxAttributeInfo()!.description }}
            </p>
          </div>
        </div>
        
        <div 
          class="hud-panel w-full max-w-2xl p-6 mb-8 relative"
          :class="{ 'opacity-0 translate-y-4': !isAnimating }"
          style="transition: all 0.5s ease 0.3s"
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
              v-for="(attr, index) in result.allAttributes"
              :key="attr.code"
              class="flex items-center gap-3"
            >
              <span class="w-8 h-8 flex items-center justify-center rounded-lg text-lg"
                    :style="{ background: `${getAttributeInfo(attr.code)!.color}30` }">
                {{ getAttributeInfo(attr.code)!.icon }}
              </span>
              <span class="w-20 text-sm" :style="{ color: getAttributeInfo(attr.code)!.color }">
                {{ attr.name }}
              </span>
              <div class="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-1000"
                  :style="{ 
                    width: index === 0 ? '100%' : `${(attr.score / result.allAttributes[0].score) * 100}%`,
                    background: `linear-gradient(90deg, ${getAttributeInfo(attr.code)!.color}, ${getAttributeInfo(attr.code)!.color}aa)`
                  }"
                ></div>
              </div>
              <span class="w-6 text-center text-sm"
                    :style="{ color: getAttributeInfo(attr.code)!.color }">
                {{ attr.score }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="flex flex-col sm:flex-row gap-4 mb-8">
          <button @click="goToProfile" class="btn-game">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            查看属性面板
          </button>
          <button @click="retakeTest" class="btn-secondary">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            重新测试
          </button>
          <button @click="goHome" class="btn-secondary">
            返回首页
          </button>
        </div>
        
        <div class="text-center">
          <p class="data-stream">EARTH ONLINE v2.0 · ATTRIBUTE ANALYSIS COMPLETE</p>
        </div>
      </div>
      
      <div v-else class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <p class="text-gray-400 mb-4">暂无测试结果</p>
          <button @click="retakeTest" class="btn-game">
            开始测试
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-title {
  background: linear-gradient(135deg, #60a5fa 0%, #06b6d4 50%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: 'Orbitron', sans-serif;
  font-weight: bold;
  letter-spacing: 0.05em;
}

.hud-panel {
  position: relative;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.hud-corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border-color: #60a5fa;
  border-style: solid;
  border-width: 0;
}

.hud-corner.tl {
  top: -1px;
  left: -1px;
  border-top-width: 2px;
  border-left-width: 2px;
  border-top-left-radius: 16px;
}

.hud-corner.tr {
  top: -1px;
  right: -1px;
  border-top-width: 2px;
  border-right-width: 2px;
  border-top-right-radius: 16px;
}

.hud-corner.bl {
  bottom: -1px;
  left: -1px;
  border-bottom-width: 2px;
  border-left-width: 2px;
  border-bottom-left-radius: 16px;
}

.hud-corner.br {
  bottom: -1px;
  right: -1px;
  border-bottom-width: 2px;
  border-right-width: 2px;
  border-bottom-right-radius: 16px;
}

.badge-hud {
  background: rgba(59, 130, 246, 0.2);
  border: 1px solid rgba(59, 130, 246, 0.5);
  border-radius: 20px;
  padding: 8px 16px;
  color: #60a5fa;
  font-family: 'Orbitron', sans-serif;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.data-stream {
  color: #60a5fa;
  font-family: 'Orbitron', sans-serif;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
}

.btn-game {
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-game:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
}

.btn-secondary {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.5);
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: rgba(59, 130, 246, 0.3);
  border-color: #60a5fa;
}
</style>
