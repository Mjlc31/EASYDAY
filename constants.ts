import { QuadrantType, Badge } from './types';
import { AlertCircle, Calendar, Users, Trash2 } from 'lucide-react';

export const QUADRANT_CONFIG = {
  [QuadrantType.Q1]: {
    title: "URGENTE & IMPORTANTE",
    subtitle: "PARE DE ENROLAR E FAÇA.",
    description: "Crises, prazos, problemas reais.",
    color: "text-danger",
    borderColor: "border-danger",
    bgColor: "bg-red-50",
    badgeColor: "bg-red-100 text-danger",
    icon: AlertCircle,
    weight: 1, 
  },
  [QuadrantType.Q2]: {
    title: "IMPORTANTE & NÃO URGENTE",
    subtitle: "AGENDA OU VAI MORRER NA GAVETA.",
    description: "Planejamento, saúde, crescimento.",
    color: "text-royal",
    borderColor: "border-royal",
    bgColor: "bg-blue-50",
    badgeColor: "bg-blue-100 text-royal",
    icon: Calendar,
    weight: 1,
  },
  [QuadrantType.Q3]: {
    title: "URGENTE & NÃO IMPORTANTE",
    subtitle: "VOCÊ NÃO É FUNCIONÁRIO DO MUNDO.",
    description: "Interrupções, reuniões inúteis, e-mail.",
    color: "text-orange-600",
    borderColor: "border-orange-600",
    bgColor: "bg-orange-50",
    badgeColor: "bg-orange-100 text-orange-700",
    icon: Users,
    weight: 1,
  },
  [QuadrantType.Q4]: {
    title: "NEM URGENTE & NEM IMPORTANTE",
    subtitle: "ELIMINAR. METADE DA VIDA É DISTRAÇÃO.",
    description: "Redes sociais, fofoca, procrastinação.",
    color: "text-slate-500",
    borderColor: "border-slate-500",
    bgColor: "bg-slate-100",
    badgeColor: "bg-slate-200 text-slate-600",
    icon: Trash2,
    weight: 1,
  }
};

export const TOUGH_LOVE_QUOTES = [
  "Tarefa atrasada = vida atrasada.",
  "Você não tem falta de tempo. Você tem excesso de desculpas.",
  "Se tudo é prioridade, nada é.",
  "A mediocridade é um vício silencioso. Cuidado.",
  "Dói? É pra doer. Crescer dói. Ficar no mesmo lugar também.",
  "Não confunda movimento com progresso.",
  "Sua 'amanhã' está lotado de fracassos de ontem.",
  "Disciplina é fazer o que odeia como se amasse.",
  "O conforto é o assassino do seu futuro.",
  "Você não está cansado, está entediado do seu próprio fracasso.",
  "Pare de negociar com a preguiça.",
];

export const XP_VALUES = {
  TASK_COMPLETION: 5,
  DAY_COMPLETE: 20,
  PERFECT_WEEK: 80,
  Q1_SAME_DAY_BONUS: 15,
  PREMIUM_MULTIPLIER: 1.5,
};

export const NOTIFICATION_TEMPLATES = {
  AGGRESSIVE: [
    "Ou você resolve essa tarefa agora, ou ela resolve você.",
    "Você disse que faria. Mentiu?",
    "Sua palavra vale tão pouco assim?",
    "Não é falta de tempo. É falta de caráter."
  ],
  SOFT: [
    "Se você não prioriza o que importa, alguém vai priorizar por você.",
    "O custo de não fazer é maior que o custo de fazer.",
    "Lembre-se do porquê você começou."
  ]
};

export const MAX_FREE_TASKS_PER_DAY = 8;
export const MAX_FREE_HISTORY_DAYS = 3;

export const INITIAL_BADGES: Badge[] = [
  { id: 'monk', name: 'Monge da Disciplina', icon: '🧘', description: '30 dias de foco ininterrupto', unlocked: false },
  { id: 'no_excuses', name: 'Zero Desculpas', icon: '⛔', description: 'Concluir tudo por 7 dias', unlocked: false },
  { id: 'anti_procrastinator', name: 'Anti-Procrastinador', icon: '⚡', description: '3 dias sem postergar nada', unlocked: false },
  { id: 'unstoppable', name: 'Imparável', icon: '🚀', description: 'Nível 5 alcançado', unlocked: false },
];

export const LEVEL_THRESHOLDS = [0, 100, 300, 700, 1500, 3000]; // Adjusted for realistic progression
export const LEVEL_TITLES = [
  "Iniciante", 
  "Consistente", 
  "Executor", 
  "Dominante", 
  "IMPARÁVEL"
];