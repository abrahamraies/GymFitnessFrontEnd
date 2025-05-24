import { useMutation } from 'react-query';
import { processTestResults } from '../../api/testApi';

export const useProcessTestResults = () => {
  return useMutation((userId: number) => processTestResults(userId));
};
