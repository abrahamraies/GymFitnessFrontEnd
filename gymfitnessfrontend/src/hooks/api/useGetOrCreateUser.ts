import { useMutation } from 'react-query';
import { getOrCreateUser } from '../../api/userApi';
import { User } from '../../interfaces/UserInterface';

export const useGetOrCreateUser = () => {
  return useMutation((userInfo: User) => getOrCreateUser(userInfo));
};
