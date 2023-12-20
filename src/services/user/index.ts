import { getGithubAxiosInstance } from '@/utils/github';

export const getUser = async (accessToken: string) => {
  const instance = getGithubAxiosInstance(accessToken);
  const { data } = await instance.get('/user');

  return data;
};

