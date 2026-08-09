<template>
  <div class="min-h-screen relative" ref="rootEl">
    <Earth3D />

    <div class="relative z-10 flex flex-col min-h-screen px-4 py-4 md:py-6">
      <div class="flex justify-between items-center mb-4 md:mb-6">
        <button @click="goHome" class="btn-secondary" data-reveal>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          退出
        </button>
        <div class="text-right" data-reveal>
          <div class="data-stream">{{ progressText }} COMPLETE</div>
          <div class="text-ink/55 text-xs font-mono tracking-[0.2em]">
            NODE {{ answers.length + 1 }}/{{ totalQuestions }}
          </div>
        </div>
      </div>

      <div class="progress-hud mb-6" data-reveal>
        <div class="progress-hud-fill" :style="{ width: progress + '%' }"></div>
      </div>

      <div class="flex-1 flex flex-col items-center justify-center">
        <div
          v-if="currentQuestion"
          class="hud-panel w-full max-w-2xl p-5 md:p-8 relative"
          :class="{ 'opacity-0 translate-y-4': isTransitioning }"
          style="transition: all 0.3s ease-out"
        >
          <div class="hud-corner tl"></div>
          <div class="hud-corner tr"></div>
          <div class="hud-corner bl"></div>
          <div class="hud-corner br"></div>
          <div class="scanline-overlay"></div>

          <div class="mb-5 relative z-10">
            <div class="flex items-center gap-3 mb-4" data-reveal>
              <span class="w-9 h-9 rounded-md flex items-center justify-center
                              bg-signal-deep text-signal text-sm font-bold font-mono shrink-0"
                    style="clip-path: polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px)">
                {{ answers.length + 1 }}
              </span>
              <span v-if="currentQuestion.multiSelect" class="badge-hud">MULTI</span>
              <span v-else class="badge-hud">SINGLE</span>
            </div>

            <h2 class="text-lg md:text-xl text-ink font-medium leading-relaxed font-cn" data-reveal>
              {{ currentQuestion.text }}
            </h2>
          </div>

          <div class="space-y-3 relative z-10">
            <template v-if="currentQuestion.multiSelect">
              <button
                v-for="option in sortedOptions"
                :key="option.id"
                @click="toggleOption(option.id)"
                class="option-card flex items-center gap-3"
                :class="{ selected: selectedOptions.includes(option.id) }"
                data-reveal-option
              >
                <div class="checkbox-box">
                  <svg v-if="selectedOptions.includes(option.id)" class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span class="text-sm md:text-base flex-1 font-cn">{{ option.label }}</span>
              </button>
            </template>

            <template v-else>
              <button
                v-for="option in sortedOptions"
                :key="option.id"
                @click="handleSingleAnswer(option.id)"
                class="option-card flex items-center gap-3"
                data-reveal-option
              >
                <div class="radio-dot"></div>
                <span class="text-sm md:text-base flex-1 font-cn">{{ option.label }}</span>
              </button>
            </template>
          </div>

          <div v-if="currentQuestion.multiSelect" class="mt-6 flex justify-end relative z-10">
            <button
              @click="confirmMultiAnswer"
              class="btn-game text-sm"
              :class="{ 'opacity-40 cursor-not-allowed': selectedOptions.length === 0 }"
              :disabled="selectedOptions.length === 0"
            >
              确认 <span class="text-signal">({{ selectedOptions.length }})</span>
            </button>
          </div>
        </div>
      </div>

      <div class="mt-6 text-center">
        <p class="data-stream">SELECT THE OPTIONS THAT BEST MATCH YOU</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { Answer, Question } from '@/types'
import { questions } from '@/data/questions'
import { getNextQuestion, calculateResult } from '@/utils/scoreCalculator'
import { revealPage } from '@/utils/anim'
import Earth3D from '@/components/Earth3D.vue'

const router = useRouter()
const currentQuestionId = ref<string | null>(null)
const answers = ref<Answer[]>([])
const selectedOptions = ref<string[]>([])
const isTransitioning = ref(false)
const rootEl = ref<HTMLElement>()
let reveal: ReturnType<typeof revealPage> | null = null

onMounted(() => {
  const firstQuestion = questions.find(q => !q.condition)
  if (firstQuestion) {
    currentQuestionId.value = firstQuestion.id
  }

  reveal = revealPage(() => rootEl.value, [
    { selector: '[data-reveal]' },
    { selector: '[data-reveal-option]', y: 16, stagger: 0.06 }
  ])
})

onUnmounted(() => reveal?.revert())

const currentQuestion = computed<Question | null>(() => {
  if (!currentQuestionId.value) return null
  return questions.find(q => q.id === currentQuestionId.value) || null
})

const sortedOptions = computed(() => {
  if (!currentQuestion.value) return []
  return [...currentQuestion.value.options].sort((a, b) => a.label.length - b.label.length)
})

watch(currentQuestionId, () => {
  selectedOptions.value = []
})

const totalQuestions = computed(() => {
  // Simulate the actual question path from current answers so the NODE
  // counter and progress bar always match the real question count.
  // Conditional questions (q1a / q1b) may or may not appear depending on
  // how q1 was answered, so a fixed count of non-conditional questions
  // would drift out of sync with the number of screens actually shown.
  let count = 0
  const visited = new Set<string>()
  let currentId: string | null = questions.find(q => !q.condition)?.id ?? null
  while (currentId && !visited.has(currentId)) {
    count++
    visited.add(currentId)
    currentId = getNextQuestion(currentId, answers.value)
  }
  return Math.max(count, 1)
})

const progress = computed(() => {
  const answeredCount = answers.value.length
  return Math.min(100, Math.round((answeredCount / totalQuestions.value) * 100))
})

const progressText = computed(() => {
  const answeredCount = answers.value.length
  const total = totalQuestions.value
  return String(Math.round((answeredCount / total) * 100)).padStart(3, '0') + '%'
})

function toggleOption(optionId: string) {
  if (!currentQuestion.value?.multiSelect) return
  const idx = selectedOptions.value.indexOf(optionId)
  if (idx === -1) {
    selectedOptions.value.push(optionId)
  } else {
    selectedOptions.value.splice(idx, 1)
  }
}

function handleSingleAnswer(optionId: string) {
  if (!currentQuestionId.value) return
  isTransitioning.value = true
  answers.value.push({
    questionId: currentQuestionId.value,
    optionIds: [optionId]
  })
  setTimeout(() => {
    const nextId = getNextQuestion(currentQuestionId.value!, answers.value)
    if (nextId) {
      currentQuestionId.value = nextId
    } else {
      const result = calculateResult(answers.value)
      localStorage.setItem('testResult', JSON.stringify(result))
      router.push('/result')
      return
    }
    isTransitioning.value = false
  }, 300)
}

function confirmMultiAnswer() {
  if (!currentQuestionId.value || selectedOptions.value.length === 0) return
  isTransitioning.value = true
  answers.value.push({
    questionId: currentQuestionId.value,
    optionIds: [...selectedOptions.value]
  })
  setTimeout(() => {
    const nextId = getNextQuestion(currentQuestionId.value!, answers.value)
    if (nextId) {
      currentQuestionId.value = nextId
    } else {
      const result = calculateResult(answers.value)
      localStorage.setItem('testResult', JSON.stringify(result))
      router.push('/result')
      return
    }
    isTransitioning.value = false
  }, 300)
}

function goHome() {
  router.push('/')
}
</script>
