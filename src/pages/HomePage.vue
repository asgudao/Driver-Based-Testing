<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Moon } from 'lucide-vue-next'

const router = useRouter()
const stars = ref<Array<{ id: number; left: string; top: string; size: string; delay: string }>>([])

onMounted(() => {
  const starCount = 100
  for (let i = 0; i < starCount; i++) {
    stars.value.push({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 3 + 1}px`,
      delay: `${Math.random() * 3}s`
    })
  }
})

function startTest() {
  router.push('/test')
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

    <div class="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
      <div class="text-center max-w-2xl">
        <div class="mb-8 animate-float">
          <div class="w-24 h-24 mx-auto flex items-center justify-center">
            <Moon class="w-20 h-20 drop-shadow-[0_0_20px_rgba(244,208,63,0.6)]" style="fill: #f4d03f; color: #f4d03f;" />
          </div>
        </div>

        <h1 class="text-4xl md:text-6xl font-serif font-bold mb-6 bg-gradient-to-r from-gold-400 via-white to-gold-500 bg-clip-text text-transparent">
          探索你的驱动力
        </h1>

        <p class="text-lg md:text-xl text-gray-300 mb-4 leading-relaxed">
          人的一生就是在追求满足、快乐与喜悦。
        </p>
        
        <p class="text-gray-400 mb-8">
          这个测试将帮助你发现，这些积极情感是从哪里得来的。
        </p>

        <div class="grid grid-cols-3 gap-3 mb-10 max-w-md mx-auto text-sm text-gray-400">
          <div class="border border-gold-500/20 rounded-lg p-2">学习驱动</div>
          <div class="border border-gold-500/20 rounded-lg p-2">成就驱动</div>
          <div class="border border-gold-500/20 rounded-lg p-2">娱乐驱动</div>
          <div class="border border-gold-500/20 rounded-lg p-2">权力驱动</div>
          <div class="border border-gold-500/20 rounded-lg p-2">社交驱动</div>
          <div class="border border-gold-500/20 rounded-lg p-2">利他驱动</div>
          <div class="border border-gold-500/20 rounded-lg p-2">审美驱动</div>
          <div class="border border-gold-500/20 rounded-lg p-2">探索驱动</div>
          <div class="border border-gold-500/20 rounded-lg p-2">稳定驱动</div>
        </div>

        <button
          @click="startTest"
          class="btn-gold text-lg"
        >
          开始探索
        </button>

        <p class="mt-6 text-gray-500 text-sm">
          测试共约12-15题，预计耗时3-5分钟
        </p>
      </div>

      <div class="absolute bottom-8 left-0 right-0 text-center">
        <div class="inline-flex items-center gap-2 text-gray-500 text-sm">
          <span class="w-2 h-2 rounded-full bg-gold-500 animate-pulse"></span>
          <span>发现真实的自己</span>
        </div>
      </div>
    </div>
  </div>
</template>
