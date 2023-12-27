import { getGithubAxiosInstance } from "@/utils/github";
import qs from "query-string";

type TQuery = {
  [key: string]: any;
};

export const getRepoCommits = async (
  accessToken: string,
  ownerName: string,
  repoName: string,
  query: TQuery = {}
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
    }
  );
  const { data } = await instance.get(url);

  return data;
};

export const getAllEvents = async (
  accessToken: string,
  userName: string,
  query: TQuery = {}
) => {
  const instance = getGithubAxiosInstance(accessToken);
  const url = qs.stringifyUrl(
    {
      url: `/users/${userName}/events`,
      query,
    },
    {
      skipNull: true,
      skipEmptyString: true,
    }
  );
  const { data } = await instance.get(url);

  return data;
};
