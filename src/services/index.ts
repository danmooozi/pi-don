import { getRepos, getRepoStars } from './repo';
import { getRepoCommits } from './commit/';
import { getUser } from './user';

async function getTotalRepoCommits({
  ownerName,
  repoName,
  accessToken,
  query,
}: {
  [key: string]: any;
}) {
  const mergedQuery = {
    ...query,
    page: 1,
    per_page: 100,
  };
  let res: any = [];

  try {
    while (true) {
      const data = await getRepoCommits(
        accessToken,
        ownerName,
        repoName,
        mergedQuery,
      );
      if (!data) return [];
      res = res.concat(data);
      const lastCommitItem = data.slice(-1);
      const hasMorePage = lastCommitItem[0]?.parents
        ? lastCommitItem[0].parents.length > 0
        : false;
      if (hasMorePage) {
        mergedQuery.page += 1;
      } else {
        break;
      }
    }
  } catch (e) {
    //TODO: github api error 처리
  }

  return res;
}

//parents 가 빈 오브젝으면 페이지 네이션끝
export const getUserCommits = async (
  accessToken: string,
  ownerName: string,
  query?: any,
) => {
  const repositoryObject: Record<string, any> = {};

  const repos = await getRepos(accessToken, ownerName);

  const jobs = repos.map(async (repo: any) => {
    const ownerName = repo.owner.login;
    const repositoryName = repo.name;
    const repositoryPath = `${ownerName}/${repositoryName}`;

    if (!repositoryObject[repositoryPath]) {
      repositoryObject[repositoryPath] = [];
    }

    repositoryObject[repositoryPath] = await getTotalRepoCommits({
      ownerName,
      accessToken,
      query,
      repoName: repositoryName,
    });
    return repositoryObject[repositoryPath];
  });

  await Promise.all(jobs);

  return repositoryObject;
};

export const getUserRepoStars = async (
  accessToken: string,
  ownerName: string,
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
