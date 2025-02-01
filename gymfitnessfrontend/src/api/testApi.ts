import axios from 'axios';
import { TestAnswer } from '../interfaces/AnswerInterface';

export const getRandomQuestions = async (count = 10) => {
  const response = await axios.get(`/api/TestQuestion/random?count=${count}`);
  return response.data;
};

export const sendTestAnswer = async (answer: TestAnswer) => {
  return await axios.post('/api/TestAnswer', answer);
};

export const processTestResults = async (userId: number) => {
  const response = await axios.post(`/api/TestAnswer/${userId}/process`);
  return response.data;
};
