export type Age = number;
export type Gender = 'male' | 'female';

export interface Field {
  length: number;
  placeholder?: string;
  type: 'text' | 'number';
}

export interface Person {
  gender: Gender;
}
