import { useQuery } from 'react-query';
import { getRandomQuestions } from '../../api/testApi';
import { Question } from '../../interfaces/QuestionInterface';

export const useRandomQuestions = () => {
  return useQuery<Question[], Error>('randomQuestions', getRandomQuestions, {
    enabled: false,
  });
};
