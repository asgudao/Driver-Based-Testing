<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import type { Answer, Question } from '@/types';
import { questions } from '@/data/questions';
import { getNextQuestion, calculateResult } from '@/utils/scoreCalculator';

const router = useRouter();
const currentQuestionId = ref<string | null>(null);
const answers = ref<Answer[]>([]);
const selectedOptions = ref<string[]>([]);
const stars = ref<Array<{
  id: number;
  left: string;
  top: string;
  size: string;
  delay: string;
}>>([]);
const isTransitioning = ref(false);

onMounted(() => {
  for (let i = 0; i < 50; i++) {
    stars.value.push({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      delay: `${Math.random() * 3}s`
    });
  }

  const firstQuestion = questions.find(q => !q.condition);
  if (firstQuestion) {
    currentQuestionId.value = firstQuestion.id;
  }
});

const currentQuestion = computed<Question | null>(() => {
  if (!currentQuestionId.value) return null;
  return questions.find(q => q.id === currentQuestionId.value) || null;
});

// Reset selections when the question changes
watch(currentQuestionId, () => {
  selectedOptions.value = [];
});

const progress = computed(() => {
  const answeredCount = answers.value.length;
  const totalQuestions = questions.filter(q => !q.condition || answers.value.some(a => {
    if (!q.condition) return true;
    return a.questionId === q.condition?.questionId && a.optionIds.some(oid => q.condition?.optionIds.includes(oid));
  })).length;
  return Math.round((answeredCount / totalQuestions) * 100);
});

const progressText = computed(() => {
  return `${answers.value.length} 题已答`;
});

function toggleOption(optionId: string) {
  if (!currentQuestion.value?.multiSelect) return;
  const idx = selectedOptions.value.indexOf(optionId);
  if (idx === -1) {
    selectedOptions.value.push(optionId);
  } else {
    selectedOptions.value.splice(idx, 1);
  }
}

function handleSingleAnswer(optionId: string) {
  if (!currentQuestionId.value) return;

  isTransitioning.value = true;

  answers.value.push({
    questionId: currentQuestionId.value,
    optionIds: [optionId]
  });

  setTimeout(() => {
    const nextId = getNextQuestion(currentQuestionId.value!, answers.value);
    if (nextId) {
      currentQuestionId.value = nextId;
    } else {
      const result = calculateResult(answers.value);
      sessionStorage.setItem('testResult', JSON.stringify(result));
      router.push('/result');
      return;
    }
    isTransitioning.value = false;
  }, 300);
}

function confirmMultiAnswer() {
  if (!currentQuestionId.value || selectedOptions.value.length === 0) return;

  isTransitioning.value = true;

  answers.value.push({
    questionId: currentQuestionId.value,
    optionIds: [...selectedOptions.value]
  });

  setTimeout(() => {
    const nextId = getNextQuestion(currentQuestionId.value!, answers.value);
    if (nextId) {
      currentQuestionId.value = nextId;
    } else {
      const result = calculateResult(answers.value);
      sessionStorage.setItem('testResult', JSON.stringify(result));
      router.push('/result');
      return;
    }
    isTransitioning.value = false;
  }, 300);
}

function goHome() {
  router.push('/');
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

    <div class="relative z-10 flex flex-col min-h-screen px-4">
      <div class="pt-8 pb-4">
        <button
          @click="goHome"
          class="btn-mystic"
        >
          ← 返回首页
        </button>
      </div>

      <div class="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
        <div class="w-full mb-8">
          <div class="flex justify-between text-gray-400 text-sm mb-2">
            <span>{{ progressText }}</span>
            <span>{{ progress }}%</span>
          </div>
          <div class="h-1 bg-gray-800 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-gold-600 to-gold-400 transition-all duration-500"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
        </div>

        <div
          v-if="currentQuestion"
          class="card-gold-frame w-full"
          :class="{ 'opacity-0 translate-y-4': isTransitioning }"
          style="transition: all 0.3s ease-out"
        >
          <div class="mb-6 gold-pattern py-2">
            <div class="flex items-center gap-3 mb-4">
              <span class="inline-block px-3 py-1 bg-gold-500/20 text-gold-400 text-xs rounded-full">
                问题 {{ answers.length + 1 }}
              </span>
              <span v-if="currentQuestion.multiSelect" class="inline-block px-3 py-1 bg-gold-500/10 text-gold-400/70 text-xs rounded-full border border-gold-500/30">
                多选
              </span>
            </div>
            <h2 class="text-xl md:text-2xl font-serif text-white leading-relaxed">
              {{ currentQuestion.text }}
            </h2>
          </div>

          <div class="space-y-3">
            <!-- Multi-select options -->
            <template v-if="currentQuestion.multiSelect">
              <button
                v-for="option in currentQuestion.options"
                :key="option.id"
                @click="toggleOption(option.id)"
                class="option-btn-multi group"
                :class="{ 'option-btn-multi-active': selectedOptions.includes(option.id) }"
              >
                <span class="text-gray-300 group-hover:text-white transition-colors block">
                  {{ option.label }}
                </span>
              </button>
            </template>

            <!-- Single-select options -->
            <template v-else>
              <button
                v-for="option in currentQuestion.options"
                :key="option.id"
                @click="handleSingleAnswer(option.id)"
                class="option-btn group"
              >
                <span class="text-gray-300 group-hover:text-white transition-colors block">
                  {{ option.label }}
                </span>
              </button>
            </template>
          </div>

          <!-- Confirm button for multi-select -->
          <div v-if="currentQuestion.multiSelect" class="mt-6 flex justify-end">
            <button
              @click="confirmMultiAnswer"
              class="btn-gold"
              :class="{ 'opacity-40 cursor-not-allowed': selectedOptions.length === 0 }"
              :disabled="selectedOptions.length === 0"
            >
              确认选择
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
