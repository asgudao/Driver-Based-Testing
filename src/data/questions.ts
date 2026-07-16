import type { Question, DriverType } from '@/types'

export const driverTypes: DriverType[] = [
  {
    code: 1,
    name: '学习',
    description: '你的快乐来源于知识的积累和心智的成长',
    detail: '你对世界充满好奇，享受学习新知识的过程。无论是阅读、研究还是探索新领域，学习本身就是你最大的乐趣。你相信知识就是力量，通过不断学习来提升自己是你人生的重要目标。',
    color: '#6366f1'
  },
  {
    code: 2,
    name: '成就',
    description: '你的快乐来源于目标的达成和卓越的表现',
    detail: '你是一个追求卓越的人，享受完成任务后的成就感。设定目标并努力实现它们，是你获得满足感的主要方式。你相信通过自己的努力可以改变命运，获得认可和成功是你前进的动力。',
    color: '#f59e0b'
  },
  {
    code: 3,
    name: '娱乐',
    description: '你的快乐来源于轻松愉悦的享受和消遣',
    detail: '你懂得享受生活，认为人生应该充满乐趣。游戏、娱乐、放松是你恢复精力的方式，你不认为娱乐是浪费时间，而是生活中不可或缺的一部分。',
    color: '#ec4899'
  },
  {
    code: 4,
    name: '权力',
    description: '你的快乐来源于影响力和掌控力',
    detail: '你喜欢主导和决策，享受影响他人的过程。领导团队、制定策略、掌控局面让你感到满足。你相信通过权力和影响力可以实现更大的目标。',
    color: '#ef4444'
  },
  {
    code: 5,
    name: '社交',
    description: '你的快乐来源于人际关系和情感连接',
    detail: '你是一个社交达人，享受与人交往的过程。朋友聚会、交流沟通、建立深厚的人际关系是你获得快乐的源泉。你相信人与人之间的连接是生命中最重要的部分。',
    color: '#10b981'
  },
  {
    code: 6,
    name: '利他',
    description: '你的快乐来源于帮助他人和奉献',
    detail: '你是一个富有同情心的人，帮助他人会给你带来极大的满足感。无论是志愿服务、帮助朋友还是做善事，看到别人因为你的帮助而变得更好，就是你最大的快乐。',
    color: '#14b8a6'
  },
  {
    code: 7,
    name: '审美',
    description: '你的快乐来源于美的欣赏和创造',
    detail: '你对美有着敏锐的感知，无论是艺术、自然还是建筑，都能让你感到内心的平静和愉悦。你相信生活中的美无处不在，欣赏美、创造美是你生活的重要追求。',
    color: '#8b5cf6'
  },
  {
    code: 8,
    name: '探索',
    description: '你的快乐来源于未知的探索和冒险',
    detail: '你是一个冒险者，喜欢探索未知的领域。无论是旅行到陌生的地方，还是尝试新的事物，探索的过程本身就让你感到兴奋和满足。你相信世界充满无限可能，等待着你去发现。',
    color: '#06b6d4'
  },
  {
    code: 9,
    name: '稳定',
    description: '你的快乐来源于安全、稳定和秩序',
    detail: '你追求平静和安宁，喜欢稳定的生活节奏。安全感和可预测性让你感到安心，你相信稳定是幸福生活的基础。你不喜欢冒险，更倾向于在熟悉的环境中享受生活。',
    color: '#64748b'
  }
]

export const questions: Question[] = [
  {
    id: 'q1',
    text: '在完全自己掌握的时间中，你更愿意',
    multiSelect: true,
    options: [
      { id: 'q1-a', label: '玩游戏', scores: [3] },
      { id: 'q1-b', label: '刷视频', scores: [3] },
      { id: 'q1-c', label: '学习知识', scores: [1] },
      { id: 'q1-d', label: '外出游玩', scores: [8] },
      { id: 'q1-e', label: '和朋友小聚', scores: [5] },
      { id: 'q1-f', label: '做一些事情，例如打扫房间', scores: [2] },
      { id: 'q1-g', label: '看电影，展览，小说等', scores: [] }
    ]
  },
  {
    id: 'q1a',
    text: '请问你玩游戏的原因是为了',
    multiSelect: true,
    condition: {
      questionId: 'q1',
      optionIds: ['q1-a']
    },
    options: [
      { id: 'q1a-a', label: '探索未知，收集癖', scores: [8] },
      { id: 'q1a-b', label: '通过技术或者智慧赢得游戏', scores: [2] },
      { id: 'q1a-c', label: '通过日积月累的运营获得成就感', scores: [9] },
      { id: 'q1a-d', label: '在游戏的过程中和他人聊天', scores: [5] },
      { id: 'q1a-e', label: '欣赏景色，人物建模，战斗特效，游戏玩法，剧情', scores: [7] },
      { id: 'q1a-f', label: '喜欢排兵布阵，决策选择', scores: [4] }
    ]
  },
  {
    id: 'q1b',
    text: '请问你看电影展览和小说是为了',
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
    text: '如果你以后从事工作，你更愿意从事',
    multiSelect: true,
    options: [
      { id: 'q2-a', label: '工资少一点但是工作也比较轻松的工作', scores: [3, 9] },
      { id: 'q2-b', label: '需要不断学习的工作', scores: [1, 8] },
      { id: 'q2-c', label: '创造，设计', scores: [2, 8, 7] },
      { id: 'q2-d', label: '领导层', scores: [4] },
      { id: 'q2-e', label: '帮助他人的工作', scores: [6] },
      { id: 'q2-f', label: '与他人交流沟通的工作', scores: [5] },
      { id: 'q2-g', label: '稳定的工作', scores: [9] }
    ]
  },
  {
    id: 'q3',
    text: '在生活中你是否愿意主动学习',
    options: [
      { id: 'q3-yes', label: '是', scores: [1] },
      { id: 'q3-no', label: '否', scores: [] }
    ]
  },
  {
    id: 'q4',
    text: '你是否会在学习之后有满足感',
    options: [
      { id: 'q4-yes', label: '是', scores: [1] },
      { id: 'q4-no', label: '否', scores: [] }
    ]
  },
  {
    id: 'q5',
    text: '在你完成一个任务之后，你会有强烈的满足感',
    options: [
      { id: 'q5-yes', label: '是', scores: [2] },
      { id: 'q5-no', label: '否', scores: [] }
    ]
  },
  {
    id: 'q6',
    text: '在进行娱乐之后，你不会有空虚的感觉，不会觉得自己的时间浪费了',
    options: [
      { id: 'q6-yes', label: '是', scores: [3] },
      { id: 'q6-no', label: '否', scores: [] }
    ]
  },
  {
    id: 'q7',
    text: '在通过安排别人工作，从而达成任务之后，你会有满足感',
    options: [
      { id: 'q7-yes', label: '是', scores: [4] },
      { id: 'q7-no', label: '否', scores: [] }
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
    text: '你在博物馆，展览中参观会觉得内心安定',
    options: [
      { id: 'q10-yes', label: '是', scores: [7] },
      { id: 'q10-no', label: '否', scores: [] }
    ]
  },
  {
    id: 'q11',
    text: '你感觉生活中有一些景观和建筑都是很美的',
    options: [
      { id: 'q11-yes', label: '是', scores: [7] },
      { id: 'q11-no', label: '否', scores: [] }
    ]
  },
  {
    id: 'q12',
    text: '你喜欢探索没有去过的地方',
    options: [
      { id: 'q12-yes', label: '是', scores: [8] },
      { id: 'q12-no', label: '否', scores: [9] }
    ]
  },
  {
    id: 'q13',
    text: '你喜欢探索未知的领域，比起你熟悉的领域',
    options: [
      { id: 'q13-yes', label: '是', scores: [8] },
      { id: 'q13-no', label: '否', scores: [9] }
    ]
  },
  {
    id: 'q14',
    text: '你更愿意尝试新的领域，哪怕会失败',
    options: [
      { id: 'q14-yes', label: '是', scores: [8] },
      { id: 'q14-no', label: '否', scores: [9] }
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
  'q14'
]
