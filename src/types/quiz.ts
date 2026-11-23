export type Language = 'uz' | 'ru' | 'en';

export type QuestionDirection = 'ru-uz' | 'uz-ru';

export type TeamColorKey = 'emerald' | 'amber' | 'rose' | 'sky' | 'violet' | 'teal';

export interface Team {
  id: string;
  name: string;
  score: number;
  color: TeamColorKey;
}

export interface QuizCell {
  id: string;
  categoryIndex: number;
  rowIndex: number;
  points: number;
  question: string;
  answer: string;
  isBonus: boolean;
  isAnswered: boolean;
  answeredByTeamId?: string | null;
}

export interface FinalQuestion {
  question: string;
  answer: string;
  enabled: boolean;
}

export interface QuizBoardData {
  title: string;
  categories: string[];
  cells: QuizCell[]; // 6 columns x 5 rows = 30 cells
  finalQuestion: FinalQuestion;
}

export interface GameSettings {
  soundEnabled: boolean;
  deductOnWrong: boolean;
  timerSeconds: number; // 0 = off, or 15, 20, 30
  language: Language;
  questionDirection: QuestionDirection;
}

export interface ScoreAction {
  teamId: string;
  teamName: string;
  delta: number;
  cellId?: string;
}
