export type StepId = 'step1' | 'step2' | 'step3' | 'step4';

export interface WordBankItem {
  word: string;
  mean: string;
  phonetic?: string;
  ex: string;
}

export interface RoleItem {
  id: string;
  name: string;
  icon: string;
  duty: string;
}

export interface IdeaCard {
  id: number;
  title: string;
  vnTitle: string;
  detail: string;
  starter: string;
}

export interface MindMapAnswers {
  origin: string[];
  types: string[];
  instruments: string[];
  costumes: string[];
}

export interface MindMapState {
  originWhen: string;
  originWhere: string;
  type1: string;
  type2: string;
  inst1: string;
  inst2: string;
  inst3: string;
  inst4: string;
  costume1: string;
  costume2: string;
  costume3: string;
}

export interface EssayCounters {
  sentenceCount: number;
  wordCount: number;
  vocabCount: number;
  foundVocab: string[];
  hasBecause: boolean;
  isValidLength: boolean;
}

export interface ChecklistState {
  capitalLetters: boolean;
  fullStops: boolean;
  twoVocabWords: boolean;
  hasBecauseWord: boolean;
  practicedSpeaking: boolean;
}
