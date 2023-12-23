import { getGithubAxiosInstance } from '@/utils/github';

export const getRepos = async (accessToken: string, userName: string) => {
  const instance = getGithubAxiosInstance(accessToken);

  const { data } = await instance.get(`/users/${userName}/repos`);

  return data;
};
