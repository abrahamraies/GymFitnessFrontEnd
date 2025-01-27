export interface Question {
    id: number;
    question: string;
    isOpen: boolean;
    options: Option[] | null;
  }
  
  export interface Option {
    id: number;
    text: string;
  }