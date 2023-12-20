import { getRepos } from './repo';
import { getRepoCommits } from './commit/';

export const getUserCommits = async (
  accessToken: string,
  ownerName: string,
  query?: any,
) => {
  const repos = await getRepos(accessToken, ownerName);
  const queue = repos.map((repo: any) => {
    const ownerName = repo.owner.login;
    const repoName = repo.name;

    console.log(ownerName, repoName)
    return () => getRepoCommits(accessToken, ownerName, repoName, query);
  });

  const jobs = Promise.all(queue.slice(10,15).map((q: any) => q()));

  return jobs
};
