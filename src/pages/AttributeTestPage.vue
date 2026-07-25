<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Answer } from '@/types'
import { attributeQuestions, attributeQuestionOrder } from '@/data/attributes'
import { calculateAttributeResult } from '@/utils/attributeCalculator'
import Earth3D from '@/components/Earth3D.vue'

const router = useRouter()
const answers = ref<Answer[]>([])
const currentQuestionId = ref<string | null>(null)
const selectedOptions = ref<string[]>([])
const isTransitioning = ref(false)

const currentQuestion = computed(() => {
  if (!currentQuestionId.value) return null
  return attributeQuestions.find(q => q.id === currentQuestionId.value)
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
})

function getNextQuestion(currentId: string, currentAnswers: Answer[]): string | null {
  const currentIndex = attributeQuestionOrder.indexOf(currentId)
  if (currentIndex >= attributeQuestionOrder.length - 1) return null
  
  const nextId = attributeQuestionOrder[currentIndex + 1]
  const nextQuestion = attributeQuestions.find(q => q.id === nextId)
  
  if (nextQuestion?.condition) {
    const conditionMet = currentAnswers.some(
      a => a.questionId === nextQuestion.condition!.questionId &&
           a.optionIds.some(id => nextQuestion.condition!.optionIds.includes(id))
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
        
        <div class="data-stream text-sm">
          ATTRIBUTE TEST {{ currentIndex }}/{{ totalQuestions }}
        </div>
        
        <button 
          v-if="currentIndex > 1" 
          @click="goBack" 
          class="text-blue-400 hover:text-blue-300 text-sm"
        >
          上一题
        </button>
        <div v-else class="w-16"></div>
      </div>
      
      <div class="progress-bar-container mb-8">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
      </div>
      
      <div v-if="currentQuestion" class="flex-1 flex flex-col">
        <div class="question-card" :class="{ 'fade-out': isTransitioning }">
          <div class="data-stream mb-4">
            QUESTION {{ currentIndex }}
          </div>
          
          <h2 class="text-xl md:text-2xl font-bold text-white mb-6" style="font-family:'Noto Sans SC',sans-serif">
            {{ currentQuestion.text }}
          </h2>
          
          <div v-if="currentQuestion.multiSelect" class="text-sm text-blue-400 mb-4">
            * 可多选
          </div>
          
          <div class="space-y-3">
            <button
              v-for="option in currentQuestion.options"
              :key="option.id"
              @click="selectOption(option.id)"
              class="option-btn w-full text-left p-4 rounded-lg border transition-all duration-200"
              :class="{
                'border-blue-500 bg-blue-500/20 text-white': selectedOptions.includes(option.id),
                'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-blue-400 hover:bg-gray-700/50': !selectedOptions.includes(option.id)
              }"
            >
              <div class="flex items-center gap-3">
                <div 
                  class="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0"
                  :class="{
                    'border-blue-400 bg-blue-500': selectedOptions.includes(option.id),
                    'border-gray-500': !selectedOptions.includes(option.id)
                  }"
                >
                  <svg v-if="selectedOptions.includes(option.id)" class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span style="font-family:'Noto Sans SC',sans-serif">{{ option.label }}</span>
              </div>
            </button>
          </div>
        </div>
        
        <div class="mt-6 flex justify-center">
          <button 
            @click="confirmAnswer"
            :disabled="selectedOptions.length === 0"
            class="confirm-btn px-8 py-3 rounded-lg font-bold transition-all duration-200"
            :class="{
              'opacity-50 cursor-not-allowed': selectedOptions.length === 0,
              'hover:scale-105': selectedOptions.length > 0
            }"
          >
            {{ currentIndex === totalQuestions ? '完成测试' : '下一题' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.progress-bar-container {
  padding: 0 20px;
}

.progress-bar {
  height: 4px;
  background: rgba(59, 130, 246, 0.2);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #06b6d4);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.question-card {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(10px);
}

.question-card.fade-out {
  opacity: 0;
  transform: translateY(-10px);
}

.option-btn {
  min-height: 52px;
}

.confirm-btn {
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
  color: white;
  border: none;
}

.data-stream {
  color: #60a5fa;
  font-family: 'Orbitron', monospace;
  letter-spacing: 0.1em;
}
</style>
