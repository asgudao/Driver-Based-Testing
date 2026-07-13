import type { Answer, TestResult } from '@/types'
import { questions, driverTypes, questionOrder } from '@/data/questions'

export function calculateResult(answers: Answer[]): TestResult {
  const scores: Record<number, number> = {}
  
  for (let i = 1; i <= 9; i++) {
    scores[i] = 0
  }

  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId)
    if (!question) return
    
    answer.optionIds.forEach(oid => {
      const option = question.options.find(o => o.id === oid)
      if (!option) return
      
      option.scores.forEach(code => {
        scores[code] = (scores[code] || 0) + 1
      })
    })
  })

  const sortedDrivers = Object.entries(scores)
    .map(([code, score]) => ({
      code: parseInt(code),
      score,
      name: driverTypes.find(d => d.code === parseInt(code))?.name || ''
    }))
    .sort((a, b) => b.score - a.score)

  const primaryDriver = sortedDrivers[0].code
  const secondaryDriver = sortedDrivers[1].code

  return {
    scores,
    primaryDriver,
    secondaryDriver,
    allDrivers: sortedDrivers
  }
}

export function getNextQuestion(currentQuestionId: string, answers: Answer[]): string | null {
  const currentIndex = questionOrder.indexOf(currentQuestionId)
  if (currentIndex === -1 || currentIndex >= questionOrder.length - 1) {
    return null
  }

  for (let i = currentIndex + 1; i < questionOrder.length; i++) {
    const nextQuestionId = questionOrder[i]
    const question = questions.find(q => q.id === nextQuestionId)
    
    if (!question) continue
    
    if (!question.condition) {
      return nextQuestionId
    }
    
    const condition = question.condition
    const conditionAnswer = answers.find(a => a.questionId === condition.questionId)
    
    if (conditionAnswer && conditionAnswer.optionIds.some(oid => condition.optionIds.includes(oid))) {
      return nextQuestionId
    }
  }

  return null
}

export function getQuestionById(id: string) {
  return questions.find(q => q.id === id)
}
