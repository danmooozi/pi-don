import axios from 'axios';

export const getGithubAxiosInstance = (accessToken: string) => {
  return axios.create({
    baseURL: 'https://api.github.com',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
