<template>
  <div class="min-h-screen relative">
    <Earth3D />
    
    <div class="relative z-10 min-h-screen flex flex-col items-center justify-start px-4 py-12">
      <div class="text-center mb-8 mt-4">
        <div class="mb-6 flex justify-center">
          <span class="badge-hud flex items-center gap-2 px-4 py-2">
            <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            EARTH ONLINE · TEST CENTER
          </span>
        </div>
        
        <h1 class="game-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-4">
          地球 Online
        </h1>
        <h2 class="text-xl md:text-2xl text-cyan-300 font-light tracking-widest mb-3" style="font-family:'Orbitron',sans-serif">
          TEST CENTER
        </h2>
        <div class="hud-divider max-w-md mx-auto"></div>
        <p class="text-blue-200/70 max-w-lg mx-auto text-base md:text-lg leading-relaxed mt-4" style="font-family:'Noto Sans SC',sans-serif">
          欢迎来到 <span class="text-cyan-300 font-semibold">地球 Online</span>，尊贵的玩家。
          完成测试可以获取您的 <span class="text-purple-300 font-semibold">职业定位</span>、
          <span class="text-purple-300 font-semibold">属性值面板</span> 以及 <span class="text-purple-300 font-semibold">技能分析</span>。
          更多测试仍在开发中，欢迎向服务器反馈您的建议。
        </p>
      </div>

      <div class="profile-entry mb-8 cursor-pointer transition-all duration-300 hover:scale-[1.02]" @click="goToProfile">
        <div class="hud-corner tl"></div>
        <div class="hud-corner tr"></div>
        <div class="hud-corner bl"></div>
        <div class="hud-corner br"></div>
        
        <div class="flex items-center gap-4">
          <div class="profile-icon">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <h3 class="text-xl font-bold text-cyan-300" style="font-family:'Noto Sans SC',sans-serif">我的属性面板</h3>
              <span v-if="hasTestResult" class="px-2 py-0.5 text-xs rounded bg-green-500/20 text-green-400 border border-green-500/30">
                已完成测试
              </span>
              <span v-else class="px-2 py-0.5 text-xs rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                预览模式
              </span>
            </div>
            <p class="text-sm text-blue-200/70" style="font-family:'Noto Sans SC',sans-serif">
              {{ hasTestResult ? '查看您的角色属性、技能矩阵和职业分配' : '完成测试后查看您的完整属性面板' }}
            </p>
          </div>
          <div class="flex items-center">
            <svg class="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      <div class="w-full max-w-4xl">
        <h3 class="text-lg font-semibold text-cyan-300 mb-4 flex items-center gap-3 justify-center" style="font-family:'Orbitron',sans-serif">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          可用测试
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            v-for="test in availableTests" 
            :key="test.id"
            class="test-card hud-panel p-6 cursor-pointer transition-all duration-300 hover:scale-105"
            @click="test.isAvailable && navigateToTest(test.route)"
            :class="{ 'opacity-60 cursor-not-allowed': !test.isAvailable }"
          >
            <div class="hud-corner tl"></div>
            <div class="hud-corner tr"></div>
            <div class="hud-corner bl"></div>
            <div class="hud-corner br"></div>
            
            <div class="flex items-start gap-4">
              <div 
                class="test-icon w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                :style="{ background: test.iconBg }"
              >
                {{ test.icon }}
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <h4 class="text-lg font-bold" :class="test.isAvailable ? 'text-cyan-300' : 'text-gray-400'" style="font-family:'Noto Sans SC',sans-serif">
                    {{ test.name }}
                  </h4>
                  <span 
                    v-if="!test.isAvailable" 
                    class="px-2 py-0.5 text-xs rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                  >
                    开发中
                  </span>
                  <span 
                    v-else 
                    class="px-2 py-0.5 text-xs rounded bg-green-500/20 text-green-400 border border-green-500/30"
                  >
                    可用
                  </span>
                </div>
                <p class="text-sm text-blue-200/70 mb-3" style="font-family:'Noto Sans SC',sans-serif">
                  {{ test.description }}
                </p>
                <div class="flex items-center gap-3 text-xs text-blue-300/60">
                  <span v-if="test.questions" class="flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ test.questions }}题
                  </span>
                  <span v-if="test.duration" class="flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ test.duration }}
                  </span>
                </div>
              </div>
              <div v-if="test.isAvailable" class="flex items-center">
                <svg class="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-12 text-center">
        <p class="data-stream">EARTH ONLINE TEST CENTER v1.0 · NEW TESTS COMING SOON</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Earth3D from '@/components/Earth3D.vue'

const router = useRouter()
const hasTestResult = ref(false)

onMounted(() => {
  const storedResult = localStorage.getItem('testResult')
  hasTestResult.value = !!storedResult
})

interface TestItem {
  id: string
  name: string
  description: string
  icon: string
  iconBg: string
  isAvailable: boolean
  route?: string
  questions?: number
  duration?: string
}

const availableTests: TestItem[] = [
  {
    id: 'driver-test',
    name: '职业测试',
    description: '检测您的玩家驱动属性，获取主职业、副职业及能力评级',
    icon: '🎯',
    iconBg: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    isAvailable: true,
    route: '/test/intro',
    questions: 15,
    duration: '5-10分钟'
  },
  {
    id: 'personality-test',
    name: '性格测试',
    description: '分析您的游戏风格与行为模式，获得个性化建议',
    icon: '🧠',
    iconBg: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    isAvailable: false,
    questions: 20,
    duration: '10分钟'
  },
  {
    id: 'skill-test',
    name: '技能树测试',
    description: '发现您的隐藏天赋与技能潜力',
    icon: '⚡',
    iconBg: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    isAvailable: false,
    questions: 25,
    duration: '15分钟'
  },
  {
    id: 'team-test',
    name: '属性值测试',
    description: '获取您的玩家等级、经验值、属性雷达图等核心数据',
    icon: '📊',
    iconBg: 'linear-gradient(135deg, #10b981, #06b6d4)',
    isAvailable: false,
    questions: 18,
    duration: '8分钟'
  }
]

function navigateToTest(route: string) {
  router.push(route)
}

function goToProfile() {
  router.push('/profile')
}
</script>

<style scoped>
.profile-entry {
  position: relative;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
  border: 1px solid rgba(96, 165, 250, 0.4);
  border-radius: 12px;
  padding: 20px 24px;
  backdrop-filter: blur(10px);
  max-width: 600px;
  width: 100%;
}

.profile-entry:hover {
  border-color: rgba(96, 165, 250, 0.7);
  box-shadow: 0 0 40px rgba(96, 165, 250, 0.3);
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%);
}

.profile-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
}

.test-card {
  position: relative;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(96, 165, 250, 0.2);
  backdrop-filter: blur(10px);
}

.test-card:hover {
  border-color: rgba(96, 165, 250, 0.5);
  box-shadow: 0 0 30px rgba(96, 165, 250, 0.2);
}

.test-icon {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}
</style>
