export interface TestAnswer {
    id?: number;
    answer?: boolean;
    [questionId: number]: string;
    selectedOptionId?: number;
    userId: number;
  }