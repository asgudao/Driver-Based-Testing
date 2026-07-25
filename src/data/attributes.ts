import type { AttributeType, Question } from '@/types'

export const attributeTypes: AttributeType[] = [
  {
    code: 1,
    name: '智慧',
    description: '分析问题和制定策略的能力',
    color: '#3b82f6',
    icon: '🧠'
  },
  {
    code: 2,
    name: '学识',
    description: '掌握知识和技能的广度与深度',
    color: '#8b5cf6',
    icon: '📚'
  },
  {
    code: 3,
    name: '耐力',
    description: '持续努力和克服困难的毅力',
    color: '#f59e0b',
    icon: '💪'
  },
  {
    code: 4,
    name: '专注度',
    description: '集中注意力和排除干扰的能力',
    color: '#10b981',
    icon: '🎯'
  },
  {
    code: 5,
    name: '爆发力',
    description: '快速行动和应对突发状况的能力',
    color: '#ef4444',
    icon: '⚡'
  },
  {
    code: 6,
    name: '洞察力',
    description: '观察细节和理解事物本质的能力',
    color: '#06b6d4',
    icon: '🔍'
  }
]

export const attributeQuestions: Question[] = [
  {
    id: 'a1',
    text: '在一个复杂的策略游戏中，你通常会怎么做？',
    multiSelect: false,
    options: [
      { id: 'a1-a', label: '快速制定多个备选方案', scores: [1] },
      { id: 'a1-b', label: '深入研究游戏规则和机制', scores: [2] },
      { id: 'a1-c', label: '耐心等待最佳时机再行动', scores: [3, 4] },
      { id: 'a1-d', label: '遇到突发情况时迅速调整策略', scores: [5] },
      { id: 'a1-e', label: '观察对手的行为模式并预判', scores: [6] }
    ]
  },
  {
    id: 'a2',
    text: '面对一份需要持续数周的项目，你的态度是？',
    multiSelect: false,
    options: [
      { id: 'a2-a', label: '分解任务，每天完成一部分', scores: [3, 4] },
      { id: 'a2-b', label: '先全面了解相关知识再开始', scores: [2] },
      { id: 'a2-c', label: '集中精力在短时间内完成', scores: [5] },
      { id: 'a2-d', label: '边做边观察，灵活调整方法', scores: [6] },
      { id: 'a2-e', label: '分析项目结构，找出最优路径', scores: [1] }
    ]
  },
  {
    id: 'a3',
    text: '在课堂或工作会议上，你通常如何表现？',
    multiSelect: true,
    options: [
      { id: 'a3-a', label: '认真记录并思考内容逻辑', scores: [1, 2] },
      { id: 'a3-b', label: '完全专注，不受外界干扰', scores: [4] },
      { id: 'a3-c', label: '快速记下要点，课后整理', scores: [5] },
      { id: 'a3-d', label: '注意观察演讲者的肢体语言', scores: [6] },
      { id: 'a3-e', label: '即使无聊也坚持听下去', scores: [3] }
    ]
  },
  {
    id: 'a4',
    text: '遇到一个从未接触过的新事物，你的第一反应是？',
    multiSelect: false,
    options: [
      { id: 'a4-a', label: '仔细阅读说明书或教程', scores: [2] },
      { id: 'a4-b', label: '先尝试操作，遇到问题再研究', scores: [5] },
      { id: 'a4-c', label: '分析它的原理和结构', scores: [1] },
      { id: 'a4-d', label: '观察他人如何使用', scores: [6] },
      { id: 'a4-e', label: '耐心练习直到熟练掌握', scores: [3, 4] }
    ]
  },
  {
    id: 'a5',
    text: '在一个需要做出决定的紧急时刻，你会？',
    multiSelect: false,
    options: [
      { id: 'a5-a', label: '快速分析利弊，立即决定', scores: [1, 5] },
      { id: 'a5-b', label: '依靠直觉和经验判断', scores: [6] },
      { id: 'a5-c', label: '保持冷静，冷静思考后再行动', scores: [4] },
      { id: 'a5-d', label: '即使有压力也坚持自己的判断', scores: [3] },
      { id: 'a5-e', label: '回忆之前学过的类似案例', scores: [2] }
    ]
  },
  {
    id: 'a6',
    text: '你觉得自己最擅长的学习方式是？',
    multiSelect: true,
    options: [
      { id: 'a6-a', label: '阅读书籍和文档', scores: [2] },
      { id: 'a6-b', label: '观看教学视频或演示', scores: [6] },
      { id: 'a6-c', label: '动手实践和实验', scores: [5] },
      { id: 'a6-d', label: '长时间专注钻研某个主题', scores: [4] },
      { id: 'a6-e', label: '归纳总结并构建知识体系', scores: [1] },
      { id: 'a6-f', label: '反复练习直到成为习惯', scores: [3] }
    ]
  },
  {
    id: 'a7',
    text: '当你感到疲惫或厌倦时，你会？',
    multiSelect: false,
    options: [
      { id: 'a7-a', label: '休息一会，然后继续', scores: [3] },
      { id: 'a7-b', label: '换个角度思考问题', scores: [1] },
      { id: 'a7-c', label: '强迫自己保持专注', scores: [4] },
      { id: 'a7-d', label: '快速完成剩余部分', scores: [5] },
      { id: 'a7-e', label: '仔细观察是否有更简单的方法', scores: [6] }
    ]
  },
  {
    id: 'a8',
    text: '在一个嘈杂的环境中，你能？',
    multiSelect: false,
    options: [
      { id: 'a8-a', label: '完全不受干扰，专注做事', scores: [4] },
      { id: 'a8-b', label: '边做事边注意周围动静', scores: [6] },
      { id: 'a8-c', label: '快速处理完离开', scores: [5] },
      { id: 'a8-d', label: '分析噪音来源并适应', scores: [1] },
      { id: 'a8-e', label: '集中精力，忽略干扰', scores: [3, 4] }
    ]
  },
  {
    id: 'a9',
    text: '面对一个看似无法解决的难题，你会？',
    multiSelect: false,
    options: [
      { id: 'a9-a', label: '将问题分解成小部分逐一解决', scores: [1] },
      { id: 'a9-b', label: '查找相关知识和案例', scores: [2] },
      { id: 'a9-c', label: '坚持不懈，反复尝试', scores: [3] },
      { id: 'a9-d', label: '换个思路，从不同角度看', scores: [6] },
      { id: 'a9-e', label: '凭直觉快速做出尝试', scores: [5] }
    ]
  },
  {
    id: 'a10',
    text: '你认为自己的优势在于？',
    multiSelect: true,
    options: [
      { id: 'a10-a', label: '善于分析和解决问题', scores: [1] },
      { id: 'a10-b', label: '知识渊博，涉猎广泛', scores: [2] },
      { id: 'a10-c', label: '能坚持到底，不轻易放弃', scores: [3] },
      { id: 'a10-d', label: '做事专注，效率很高', scores: [4] },
      { id: 'a10-e', label: '反应迅速，行动力强', scores: [5] },
      { id: 'a10-f', label: '观察力敏锐，注意细节', scores: [6] }
    ]
  }
]

export const attributeQuestionOrder = [
  'a1',
  'a2',
  'a3',
  'a4',
  'a5',
  'a6',
  'a7',
  'a8',
  'a9',
  'a10'
]
