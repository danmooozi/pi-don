import { getGithubAxiosInstance } from "@/utils/github";

export const getRepos = async (accessToken: string, userName: string) => {
  const instance = getGithubAxiosInstance(accessToken);

  const { data } = await instance.get(`/users/${userName}/repos`);

  return data;
};

export const getRepoStars = async (
  accessToken: string,
  ownerName: string,
  repoName: string
) => {
  const instance = getGithubAxiosInstance(accessToken);

  const { data } = await instance.get(`/repos/${ownerName}/${repoName}`);

  return data.stargazers_count || 0;
};
