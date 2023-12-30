import { getRepos, getRepoStars } from "./repo";
import { getRepoCommits, getAllEvents } from "./commit/";
import { getUser } from "./user";

const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

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
  email: string
) => {
  console.log("go");
  let findMore = true;
  let page = 1;
  const thisYearCommit: any[] = [];
  while (findMore) {
    await delay(2000);
    let events = [];
    try {
      events = await getAllEvents(accessToken, userName, {
        page,
        per_page: 100,
        timeout: 5000,
      });
      console.log(events);
    } catch (e) {
      console.log(e);
      return;
    }

    page += 1;

    console.log(events.length);
    if (events.length < 100) {
      findMore = false;
      break;
    }

    events.forEach((event: any) => {
      if (event.created_at < "2023-01-01T00:00:00Z") {
        findMore = false;
        return;
      }

      if (event.type === "PushEvent") {
        // console.log(event);
        event.payload.commits.forEach((commit: any) => {
          if (
            commit.author.name === userName ||
            commit.author.email === email
          ) {
            // console.log(count++, commit);
            thisYearCommit.push(commit);
          }
        });
      }
    });
  }

  console.log("end", thisYearCommit.length);
  return thisYearCommit;
};
