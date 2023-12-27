import { getRepos, getRepoStars } from "./repo";
import { getRepoCommits } from "./commit/";
import { getUser } from "./user";

export const getUserCommits = async (
  accessToken: string,
  ownerName: string,
  query?: any
) => {
  const repos = await getRepos(accessToken, ownerName);
  const queue = repos.map((repo: any) => {
    const ownerName = repo.owner.login;
    const repoName = repo.name;

    return () => getRepoCommits(accessToken, ownerName, repoName, query);
  });

  const jobs = Promise.all(queue.slice(10, 15).map((q: any) => q()));

  return jobs;
};

export const getUserRepoStars = async (
  accessToken: string,
  ownerName: string
) => {
  const repos = await getRepos(accessToken, ownerName);

  const queue = repos.map((repo: any) => {
    const ownerName = repo.owner.login;
    const repoName = repo.name;

    return getRepoStars(accessToken, ownerName, repoName);
  });

  const jobs = Promise.all(queue);
  return (await jobs).reduce((acc, cur) => {
    console.log(acc, cur);
    return acc + cur;
  }, 0);
};

export const getFriendsCount = async (accessToken: string) => {
  const user = await getUser(accessToken);
  const followerCount = user.followers || 0;
  const followingCount = user.following || 0;

  return { followerCount, followingCount };
};
