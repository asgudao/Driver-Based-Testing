export interface Option {
  id: string;
  label: string;
  scores: number[];
}

export interface Question {
  id: string;
  text: string;
  options: Option[];
  multiSelect?: boolean;
  condition?: {
    questionId: string;
    optionIds: string[];
  };
}

export interface DriverType {
  code: number;
  name: string;
  description: string;
  detail?: string;
  color: string;
}

export interface AttributeType {
  code: number;
  name: string;
  description: string;
  color: string;
  icon: string;
}

export interface Answer {
  questionId: string;
  optionIds: string[];
}

export interface TestResult {
  scores: Record<number, number>;
  primaryDriver: number;
  secondaryDriver: number;
  allDrivers: { code: number; score: number; name: string }[];
}

export interface AttributeResult {
  scores: Record<number, number>;
  maxAttribute: number;
  allAttributes: { code: number; score: number; name: string }[];
}
