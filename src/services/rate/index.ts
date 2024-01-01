import { getGithubAxiosInstance } from '@/utils/github';
import qs from 'query-string';

export const getRateLimit = async (accessToken: any) => {
  const instance = getGithubAxiosInstance(accessToken);

  const url = qs.stringifyUrl({
    url: `/rate_limit`,
  });

  const { data } = await instance({
    method: 'get',
    url,
  });

  return data;
};
