import axios from 'axios';
import { User } from '../interfaces/UserInterface';

export const getOrCreateUser = async (userInfo: User) => {
  const response = await axios.post('/api/user/getorcreate', userInfo);
  return response.data;
};
