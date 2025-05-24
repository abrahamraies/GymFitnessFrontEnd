import { useMutation } from 'react-query';
import { sendTestAnswer } from '../../api/testApi';
import { TestAnswer } from '../../interfaces/AnswerInterface';

export const useSendTestAnswer = () => {
  return useMutation((answer: TestAnswer) => sendTestAnswer(answer));
};
