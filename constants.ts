import type { Constitution, Season } from './types';

export const CONSTITUTIONS: Constitution[] = [
  '平和质 (Balanced)',
  '气虚质 (Qi-Deficient)',
  '阳虚质 (Yang-Deficient)',
  '阴虚质 (Yin-Deficient)',
  '痰湿质 (Phlegm-Dampness)',
  '湿热质 (Damp-Heat)',
  '血瘀质 (Blood Stasis)',
  '气郁质 (Qi Stagnation)',
  '特禀质 (Allergic)',
];

export const SEASONS: Season[] = ['春季', '夏季', '秋季', '冬季'];

export const TEST_QUESTIONS = [
  {
    id: 'q1',
    text: '您的精力如何？',
    options: ['精力充沛', '还行，偶尔疲惫', '容易疲劳，精神不振'],
  },
  {
    id: 'q2',
    text: '您对冷热的偏好是？',
    options: ['耐寒耐热，适应力强', '怕冷，手脚经常冰凉', '怕热，手心脚心发热'],
  },
  {
    id: 'q3',
    text: '您的皮肤状况？',
    options: ['润泽有弹性', '干燥，尤其在秋冬', '面部油腻，易长痘痘'],
  },
  {
    id: 'q4',
    text: '您的情绪状态通常是？',
    options: ['平和开朗', '容易紧张、焦虑', '情绪低落，容易烦闷'],
  },
  {
    id: 'q5',
    text: '您的消化情况如何？',
    options: ['良好，无不适', '食欲不振，饭后易腹胀', '大便黏腻，不成形'],
  },
  {
    id: 'q6',
    text: '您容易出汗吗？',
    options: ['正常，不过多也不过少', '稍微一动就出大汗', '晚上睡觉时容易出汗（盗汗）'],
  },
  {
    id: 'q7',
    text: '您的舌头看起来像？',
    options: ['颜色淡红，舌苔薄白', '舌体胖大，颜色淡', '舌质偏红，舌苔少或无苔', '舌苔白厚或黄腻'],
  },
];
