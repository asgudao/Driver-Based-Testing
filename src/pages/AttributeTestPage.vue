<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Answer } from '@/types'
import { attributeQuestions, attributeQuestionOrder } from '@/data/attributes'
import { calculateAttributeResult } from '@/utils/attributeCalculator'
import { revealPage } from '@/utils/anim'
import Earth3D from '@/components/Earth3D.vue'

const router = useRouter()
const answers = ref<Answer[]>([])
const currentQuestionId = ref<string | null>(null)
const selectedOptions = ref<string[]>([])
const isTransitioning = ref(false)
const rootEl = ref<HTMLElement>()
let reveal: ReturnType<typeof revealPage> | null = null

const currentQuestion = computed(() => {
  if (!currentQuestionId.value) return null
  return attributeQuestions.find((q) => q.id === currentQuestionId.value)
})

const totalQuestions = attributeQuestionOrder.length
const currentIndex = computed(() => {
  if (!currentQuestionId.value) return 0
  return attributeQuestionOrder.indexOf(currentQuestionId.value) + 1
})

const progress = computed(() => {
  return (currentIndex.value / totalQuestions) * 100
})

onMounted(() => {
  currentQuestionId.value = attributeQuestionOrder[0]

  reveal = revealPage(() => rootEl.value, [
    { selector: '[data-reveal]' },
    { selector: '[data-reveal-option]', y: 16, stagger: 0.06 }
  ])
})

onUnmounted(() => reveal?.revert())

function getNextQuestion(currentId: string, currentAnswers: Answer[]): string | null {
  const currentIndex = attributeQuestionOrder.indexOf(currentId)
  if (currentIndex >= attributeQuestionOrder.length - 1) return null

  const nextId = attributeQuestionOrder[currentIndex + 1]
  const nextQuestion = attributeQuestions.find((q) => q.id === nextId)

  if (nextQuestion?.condition) {
    const conditionMet = currentAnswers.some(
      (a) =>
        a.questionId === nextQuestion.condition!.questionId &&
        a.optionIds.some((id) => nextQuestion.condition!.optionIds.includes(id))
    )
    if (!conditionMet) {
      return getNextQuestion(nextId, currentAnswers)
    }
  }

  return nextId
}

function selectOption(optionId: string) {
  if (!currentQuestion.value?.multiSelect) {
    selectedOptions.value = [optionId]
  } else {
    const index = selectedOptions.value.indexOf(optionId)
    if (index > -1) {
      selectedOptions.value.splice(index, 1)
    } else {
      selectedOptions.value.push(optionId)
    }
  }
}

function confirmAnswer() {
  if (!currentQuestionId.value || selectedOptions.value.length === 0) return
  isTransitioning.value = true

  answers.value.push({
    questionId: currentQuestionId.value,
    optionIds: [...selectedOptions.value]
  })
  selectedOptions.value = []

  setTimeout(() => {
    const nextId = getNextQuestion(currentQuestionId.value!, answers.value)
    if (nextId) {
      currentQuestionId.value = nextId
    } else {
      const result = calculateAttributeResult(answers.value)
      const existingData = localStorage.getItem('userData')
      let userData = existingData ? JSON.parse(existingData) : {}
      userData.attributeResult = result
      localStorage.setItem('userData', JSON.stringify(userData))
      router.push('/attribute-result')
      return
    }
    isTransitioning.value = false
  }, 300)
}

function goBack() {
  if (answers.value.length > 0) {
    answers.value.pop()
    selectedOptions.value = []

    const prevIndex = currentIndex.value - 2
    if (prevIndex >= 0) {
      currentQuestionId.value = attributeQuestionOrder[prevIndex]
    }
  }
}

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen relative" ref="rootEl">
    <Earth3D />

    <div class="relative z-10 min-h-screen flex flex-col px-4 py-6">
      <div class="flex justify-between items-center mb-6">
        <button @click="goHome" class="back-btn" data-reveal>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回大厅
        </button>

        <div class="data-stream text-sm" data-reveal>
          ATTRIBUTE TEST {{ currentIndex }}/{{ totalQuestions }}
        </div>

        <button
          v-if="currentIndex > 1"
          @click="goBack"
          class="back-btn !px-3 !py-1.5 text-sm"
        >
          上一题
        </button>
        <div v-else class="w-20"></div>
      </div>

      <div class="px-1 mb-8" data-reveal>
        <div class="progress-hud">
          <div class="progress-hud-fill" :style="{ width: progress + '%' }"></div>
        </div>
      </div>

      <div v-if="currentQuestion" class="flex-1 flex flex-col">
        <div
          class="hud-panel p-5 md:p-8 relative q-fade"
          :class="{ 'fade-out': isTransitioning }"
        >
          <div class="hud-corner tl"></div>
          <div class="hud-corner tr"></div>
          <div class="hud-corner bl"></div>
          <div class="hud-corner br"></div>
          <div class="scanline-overlay"></div>

          <div class="relative z-10">
            <div class="data-stream mb-4" data-reveal>
              QUESTION {{ currentIndex }}
            </div>

            <h2 class="text-xl md:text-2xl font-bold text-ink mb-6 font-cn" data-reveal>
              {{ currentQuestion.text }}
            </h2>

            <div v-if="currentQuestion.multiSelect" class="text-sm text-signal/80 mb-4 font-cn">
              * 可多选
            </div>

            <div class="space-y-3">
              <template v-if="currentQuestion.multiSelect">
                <button
                  v-for="option in currentQuestion.options"
                  :key="option.id"
                  @click="selectOption(option.id)"
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
                  v-for="option in currentQuestion.options"
                  :key="option.id"
                  @click="selectOption(option.id)"
                  class="option-card flex items-center gap-3"
                  :class="{ selected: selectedOptions.includes(option.id) }"
                  data-reveal-option
                >
                  <div class="radio-dot"></div>
                  <span class="text-sm md:text-base flex-1 font-cn">{{ option.label }}</span>
                </button>
              </template>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-center">
          <button
            @click="confirmAnswer"
            :disabled="selectedOptions.length === 0"
            class="btn-game"
          >
            {{ currentIndex === totalQuestions ? '完成测试' : '下一题' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.q-fade {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.q-fade.fade-out {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
