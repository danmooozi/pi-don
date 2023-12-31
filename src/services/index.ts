import { getRepos, getRepoStars } from './repo';
import { getRepoCommits, getAllEvents } from './commit/';
import { getUser } from './user';

const startAt = new Date('2023-01-01T00:00:00Z');
const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getUserCommits = async (
  accessToken: string,
  ownerName: string,
  query?: any,
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
    return acc + cur;
  }, 0);
};

export const getFriendsCount = async (accessToken: string) => {
  const user = await getUser(accessToken);
  const followerCount = user.followers || 0;
  const followingCount = user.following || 0;

  return { followerCount, followingCount };
};

export const getUserEvents = async (
  accessToken: string,
  userName: string,
  email: string,
) => {
  let findMore = true;
  let page = 1;
  let thisYearCommit: any[] = [];
  while (findMore) {
    await delay(2000);

    let events = [];
    try {
      events = await getAllEvents(accessToken, userName, {
        page,
        per_page: 100,
      });
    } catch (e) {
      console.log(e);
    }

    page += 1;

    if (events.length < 100) {
      findMore = false;
    }

    events = events.filter((event: any) => {
      const createdAt = new Date(event.created_at);
      const is2023Over = createdAt.getTime() >= startAt.getTime();
      return is2023Over;
    });

    findMore = events.length !== 0;

    events
      .filter((event: any) => event.type === 'PushEvent')
      .forEach((event: any) => {
        const myCommits = event.payload.commits
          .filter((commit: any) => {
            const isCommitAuthor =
              commit.author.name === userName || commit.author.email === email;
            return isCommitAuthor;
          })
          .map((myCommit: any) => ({
            ...myCommit,
            createdAt: event.created_at,
          }));

        thisYearCommit = thisYearCommit.concat(myCommits);
      });
  }

  console.log('end', thisYearCommit.length);
  return thisYearCommit;
};
