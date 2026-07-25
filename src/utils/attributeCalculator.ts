import type { Answer, AttributeResult } from '@/types'
import { attributeTypes } from '@/data/attributes'
import { attributeQuestions } from '@/data/attributes'

export function calculateAttributeResult(answers: Answer[]): AttributeResult {
  const scores: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }

  answers.forEach(answer => {
    const question = attributeQuestions.find(q => q.id === answer.questionId)
    if (!question) return

    answer.optionIds.forEach(optionId => {
      const option = question.options.find(o => o.id === optionId)
      if (option) {
        option.scores.forEach(attrCode => {
          scores[attrCode] = (scores[attrCode] || 0) + 1
        })
      }
    })
  })

  let maxAttribute = 1
  let maxScore = 0
  Object.entries(scores).forEach(([code, score]) => {
    if (score > maxScore) {
      maxScore = score
      maxAttribute = parseInt(code)
    }
  })

  const allAttributes = attributeTypes.map(attr => ({
    code: attr.code,
    name: attr.name,
    score: scores[attr.code] || 0
  })).sort((a, b) => b.score - a.score)

  return {
    scores,
    maxAttribute,
    allAttributes
  }
}
