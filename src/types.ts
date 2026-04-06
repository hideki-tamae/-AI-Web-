export interface Resources {
  energy: number;
  food: number;
  materials: number;
  knowledge: number;
}

export interface Population {
  total: number;
  growthRate: number;
  happiness: number;
}

export interface ResearchItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  progress: number; // 0 to 100
  isCompleted: boolean;
  category: 'energy' | 'food' | 'materials' | 'knowledge' | 'military';
}

export interface SystemEvent {
  id: string;
  timestamp: number;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

export interface CareLog {
  id: string;
  timestamp: number;
  category: 'health' | 'education' | 'social' | 'environment';
  value: number;
  description: string;
}

export interface CivilizationState {
  uid: string;
  resources: Resources;
  population: Population;
  research: ResearchItem[];
  events: SystemEvent[];
  careLogs: CareLog[];
  lastUpdate: number;
}
