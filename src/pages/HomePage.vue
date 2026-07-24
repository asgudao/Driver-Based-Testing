<template>
  <div class="min-h-screen relative">
    <Earth3D />
    
    <div class="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div class="absolute top-4 left-4">
        <button 
          @click="goBack" 
          class="back-btn flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-500/30 bg-blue-900/20 text-blue-300 hover:bg-blue-900/40 transition-all"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回大厅
        </button>
      </div>

      <div class="text-center mb-8 mt-8">
        <div class="mb-6 flex justify-center">
          <span class="badge-hud flex items-center gap-2 px-4 py-2">
            <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            EARTH ONLINE · CLASS TEST
          </span>
        </div>
        
        <h1 class="game-title text-4xl sm:text-5xl md:text-6xl mb-4">
          职业测试
        </h1>
        <h2 class="text-xl md:text-2xl text-cyan-300 font-light tracking-widest mb-3" style="font-family:'Orbitron',sans-serif">
          CLASS DETECTION
        </h2>
        <div class="hud-divider max-w-md mx-auto"></div>
        <p class="text-blue-200/70 max-w-lg mx-auto text-base md:text-lg leading-relaxed mt-4" style="font-family:'Noto Sans SC',sans-serif">
          在地球 Online 这个沙盒世界中，每个玩家都有独特的<span class="text-purple-300 font-semibold">驱动属性</span>。
          完成检测，解锁你的<span class="text-cyan-300 font-semibold">专属职业</span>，发现你的主副职业定位。
        </p>
      </div>

      <div class="hud-panel p-6 md:p-8 max-w-xl w-full mb-8 relative">
        <div class="hud-corner tl"></div>
        <div class="hud-corner tr"></div>
        <div class="hud-corner bl"></div>
        <div class="hud-corner br"></div>
        <div class="scanline-overlay"></div>
        
        <h3 class="text-lg font-semibold text-cyan-300 mb-4 flex items-center gap-3" style="font-family:'Orbitron',sans-serif">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          测试说明
        </h3>
        
        <div class="space-y-3 text-blue-200/80 text-sm" style="font-family:'Noto Sans SC',sans-serif">
          <p class="flex items-start gap-3">
            <span class="data-stream mt-0.5">01</span>
            <span>测试包含 <span class="text-cyan-300">15-17 个问题</span>，预计耗时 3-5 分钟</span>
          </p>
          <p class="flex items-start gap-3">
            <span class="data-stream mt-0.5">02</span>
            <span>部分题目支持<span class="text-cyan-300">多选</span>，请选择最符合你的选项</span>
          </p>
          <p class="flex items-start gap-3">
            <span class="data-stream mt-0.5">03</span>
            <span>测试完成后，获得你的 <span class="text-purple-300">主/副职业</span> 及详细属性分析</span>
          </p>
        </div>

        <div class="hud-divider"></div>

        <div class="grid grid-cols-3 gap-2">
          <div v-for="item in classPreview" :key="item.name" 
               class="role-card text-center p-2"
               :style="{ borderColor: item.color + '40' }">
            <div class="role-card-icon mx-auto mb-1 text-xs"
                 :style="{ background: item.color }">
              {{ item.icon }}
            </div>
            <div class="text-xs text-blue-300" style="font-family:'Noto Sans SC',sans-serif">{{ item.name }}</div>
          </div>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-4">
        <button @click="startTest" class="btn-game text-lg px-8 py-4">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          开始测试
        </button>
      </div>

      <div class="mt-12 text-center">
        <p class="data-stream">EARTH ONLINE v1.0 · CLASS TEST MODULE</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Earth3D from '@/components/Earth3D.vue'
import { driverTypes } from '@/data/questions'

const router = useRouter()

const classPreview = driverTypes.map(d => ({
  name: d.name,
  color: d.color,
  icon: d.name.charAt(0)
}))

function goBack() {
  router.push('/')
}

function startTest() {
  router.push('/test')
}
</script>
