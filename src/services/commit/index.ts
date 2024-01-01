import { getGithubAxiosInstance } from '@/utils/github';
import qs from 'query-string';
import { Octokit } from 'octokit';

type TQuery = {
  [key: string]: any;
};

const checkHasMoreEvent = (headers: Record<string, any>) => {
  const reg = /rel=\\\"next\\"/g;
  return reg.test(headers.link);
};

export const getRepoCommits = async (
  accessToken: string,
  ownerName: string,
  repoName: string,
  query: TQuery = {},
) => {
  const instance = getGithubAxiosInstance(accessToken);
  const url = qs.stringifyUrl(
    {
      url: `/repos/${ownerName}/${repoName}/commits`,
      query,
    },
    {
      skipNull: true,
      skipEmptyString: true,
    },
  );
  const { data } = await instance.get(url);

  return data;
};

export const getAllEvents = async (
  accessToken: string,
  userName: string,
  query: TQuery = {},
) => {
  /*   const instance = getGithubAxiosInstance(accessToken); */
  const octokit = new Octokit({
    auth: accessToken,
  });
  const url = qs.stringifyUrl(
    {
      url: `/users/${userName}/events`,
      query,
    },
    {
      skipNull: true,
      skipEmptyString: true,
    },
  );
  const { data, headers } = await octokit.request(`GET ${url}`, {
    username: 'USERNAME',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  const hasNext = checkHasMoreEvent(headers);
  return {
    data,
    hasNext,
  };

  /* const { data } = await instance.get(url, {
      timeout: 5000,
    });

    return data; */
};
