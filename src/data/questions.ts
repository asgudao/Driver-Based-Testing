import type { Question, DriverType } from '@/types'

export const driverTypes: DriverType[] = [
  {
    code: 1,
    name: '学者',
    description: '你是知识的追求者，在学习中获得乐趣',
    detail: '你对这个世界充满好奇，享受学习新技能和知识的过程。无论是研读古籍、探索科技前沿，还是理解复杂理论，学习本身就是你最大的乐趣。你相信知识就是力量，通过不断学习来提升自己是你的核心追求。',
    color: '#6366f1'
  },
  {
    code: 2,
    name: '实干者',
    description: '你是目标的达成者，在完成中获得满足',
    detail: '你是一个务实且追求卓越的玩家，享受完成任务后的成就感。设定目标、制定计划、努力实现它们，是你获得满足感的主要方式。你相信通过自己的努力可以改变现状，获得成就和认可是你前进的动力。',
    color: '#f59e0b'
  },
  {
    code: 3,
    name: '纨绔子弟',
    description: '你是快乐的追寻者，在享受中体验生活',
    detail: '你懂得享受地球Online的每一刻，认为人生应该充满乐趣。游戏、娱乐、放松是你恢复精力的方式，你不认为娱乐是浪费时间，而是体验生活的重要途径。你善于在日常中发现乐趣，让生活充满色彩。',
    color: '#ec4899'
  },
  {
    code: 4,
    name: '领导者',
    description: '你是天生的领袖，在掌控中实现价值',
    detail: '你喜欢主导团队和战局，享受指挥和决策的过程。领导公会、制定战略、掌控局面让你感到兴奋和满足。你相信通过领导力和影响力可以实现更大的目标，带领团队走向胜利是你的使命。',
    color: '#ef4444'
  },
  {
    code: 5,
    name: '社交家',
    description: '你是社交达人，在连接中发现温暖',
    detail: '你热爱与其他玩家交流互动，建立深厚的友情。组队任务、聊天聚会、共同冒险是你获得快乐的源泉。你相信人际关系是地球Online中最珍贵的财富，与他人的连接让你的游戏体验更加丰富。',
    color: '#10b981'
  },
  {
    code: 6,
    name: '荣誉骑士',
    description: '你是善良的守护者，在奉献中找到意义',
    detail: '你是一个富有正义感和同情心的玩家，帮助他人会给你带来极大的满足感。无论是救助萌新、帮助队友完成困难任务，还是做一些力所能及的善事，看到他人因你的帮助而受益，就是你最大的快乐。',
    color: '#14b8a6'
  },
  {
    code: 7,
    name: '艺术家',
    description: '你是美的感知者，在欣赏中获得宁静',
    detail: '你对美有着敏锐的感知力，无论是游戏中的壮丽风景、建筑设计、艺术作品，还是现实中的自然景观，都能让你感到内心的平静和愉悦。你相信美无处不在，发现美、欣赏美、甚至创造美是你追求的生活方式。',
    color: '#8b5cf6'
  },
  {
    code: 8,
    name: '冒险者',
    description: '你是未知的探索者，在冒险中体验刺激',
    detail: '你是一个真正的冒险家，渴望探索每一片未知的地图。无论是发现隐藏的副本、尝试新的玩法，还是突破自我极限，探索的过程本身就让你感到兴奋和满足。你相信地球Online充满无限可能，等待你去发现。',
    color: '#06b6d4'
  },
  {
    code: 9,
    name: '守护者',
    description: '你是稳定的追求者，在秩序中获得安心',
    detail: '你追求平静和安宁，喜欢稳定可预测的游戏节奏。安全区和熟悉的环境让你感到放松，你相信稳定是幸福游戏体验的基础。你不喜欢不必要的冒险，更倾向于在舒适的区域内享受游戏。',
    color: '#64748b'
  }
]

export const questions: Question[] = [
  {
    id: 'q1',
    text: '在玩家完全自由的时间中，你更愿意进行什么活动？',
    multiSelect: true,
    options: [
      { id: 'q1-a', label: '玩游戏（电子/线下）', scores: [3] },
      { id: 'q1-b', label: '刷视频', scores: [3] },
      { id: 'q1-c', label: '学习知识', scores: [1] },
      { id: 'q1-d', label: '探索地球Online地图', scores: [8] },
      { id: 'q1-e', label: '和其他玩家小聚', scores: [5] },
      { id: 'q1-f', label: '完成支线任务，如打扫房间', scores: [2] },
      { id: 'q1-g', label: '欣赏艺术作品', scores: [] }
    ]
  },
  {
    id: 'q1a',
    text: '你玩游戏的主要原因是什么？',
    multiSelect: true,
    condition: {
      questionId: 'q1',
      optionIds: ['q1-a']
    },
    options: [
      { id: 'q1a-a', label: '探索未知，收集藏品', scores: [8] },
      { id: 'q1a-b', label: '通过技术或智慧获胜', scores: [2] },
      { id: 'q1a-c', label: '通过日积月累的运营获得成就感', scores: [9] },
      { id: 'q1a-d', label: '在游戏中与他人聊天', scores: [5] },
      { id: 'q1a-e', label: '欣赏景色、人物建模、战斗特效、游戏玩法、剧情', scores: [7] },
      { id: 'q1a-f', label: '喜欢排兵布阵，决策选择', scores: [4] }
    ]
  },
  {
    id: 'q1b',
    text: '你欣赏艺术作品的主要原因是什么？',
    multiSelect: true,
    condition: {
      questionId: 'q1',
      optionIds: ['q1-g']
    },
    options: [
      { id: 'q1b-a', label: '欣赏作品', scores: [7] },
      { id: 'q1b-b', label: '从中学习', scores: [1] }
    ]
  },
  {
    id: 'q2',
    text: '你以后从事工作，更愿意选择哪种？',
    multiSelect: true,
    options: [
      { id: 'q2-a', label: '工资少一点但工作轻松', scores: [3, 9] },
      { id: 'q2-b', label: '需要不断学习的工作', scores: [1, 8] },
      { id: 'q2-c', label: '创造、设计类工作', scores: [2, 8, 7] },
      { id: 'q2-d', label: '领导岗位', scores: [4] },
      { id: 'q2-e', label: '帮助他人的工作', scores: [6] },
      { id: 'q2-f', label: '与他人交流沟通的工作', scores: [5] },
      { id: 'q2-g', label: '稳定的工作', scores: [9] }
    ]
  },
  {
    id: 'q3',
    text: '在生活中，你是否愿意主动学习？',
    options: [
      { id: 'q3-yes', label: '是', scores: [1] },
      { id: 'q3-no', label: '否', scores: [] }
    ]
  },
  {
    id: 'q4',
    text: '你是否会在学习之后有满足感？',
    options: [
      { id: 'q4-yes', label: '是', scores: [1] },
      { id: 'q4-no', label: '否', scores: [] }
    ]
  },
  {
    id: 'q5',
    text: '在你完成一个任务之后，你会有强烈的满足感吗？',
    options: [
      { id: 'q5-yes', label: '是', scores: [2] },
      { id: 'q5-no', label: '否', scores: [] }
    ]
  },
  {
    id: 'q6',
    text: '在进行娱乐之后，你不会有空虚的感觉，不会觉得自己的时间浪费了',
    options: [
      { id: 'q6-yes', label: '是', scores: [] },
      { id: 'q6-no', label: '否', scores: [3] }
    ]
  },
  {
    id: 'q7',
    text: '在通过安排别人工作来达成任务之后，你会有满足感吗？',
    options: [
      { id: 'q7-yes', label: '是', scores: [4] },
      { id: 'q7-no', label: '否', scores: [5] }
    ]
  },
  {
    id: 'q8',
    text: '如果你觉得非常疲惫，你可能更倾向于通过他人进行排解',
    options: [
      { id: 'q8-yes', label: '是', scores: [5] },
      { id: 'q8-no', label: '否', scores: [] }
    ]
  },
  {
    id: 'q9',
    text: '你在帮助他人（或动物）或者做了一件好事之后，会有很满足的感觉',
    options: [
      { id: 'q9-yes', label: '是', scores: [6] },
      { id: 'q9-no', label: '否', scores: [] }
    ]
  },
  {
    id: 'q10',
    text: '如果在帮助他人可能有风险的情况下，你还是愿意尝试',
    options: [
      { id: 'q10-yes', label: '是', scores: [6] },
      { id: 'q10-no', label: '否', scores: [] }
    ]
  },
  {
    id: 'q11',
    text: '你在博物馆、展览中参观会觉得内心安定',
    options: [
      { id: 'q11-yes', label: '是', scores: [7] },
      { id: 'q11-no', label: '否', scores: [] }
    ]
  },
  {
    id: 'q12',
    text: '你感觉生活中有一些景观和建筑都是很美的',
    options: [
      { id: 'q12-yes', label: '是', scores: [7] },
      { id: 'q12-no', label: '否', scores: [] }
    ]
  },
  {
    id: 'q13',
    text: '你喜欢探索没有去过的地方',
    options: [
      { id: 'q13-yes', label: '是', scores: [8] },
      { id: 'q13-no', label: '否', scores: [9] }
    ]
  },
  {
    id: 'q14',
    text: '你喜欢探索未知的领域，比起你熟悉的领域',
    options: [
      { id: 'q14-yes', label: '是', scores: [8] },
      { id: 'q14-no', label: '否', scores: [9] }
    ]
  },
  {
    id: 'q15',
    text: '你更愿意尝试新的领域，哪怕会失败',
    options: [
      { id: 'q15-yes', label: '是', scores: [8] },
      { id: 'q15-no', label: '否', scores: [9] }
    ]
  }
]

export const questionOrder = [
  'q1',
  'q1a',
  'q1b',
  'q2',
  'q3',
  'q4',
  'q5',
  'q6',
  'q7',
  'q8',
  'q9',
  'q10',
  'q11',
  'q12',
  'q13',
  'q14',
  'q15'
]
