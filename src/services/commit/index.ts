import { Octokit } from "octokit";

type TQuery = {
  [key: string]: any;
};

export const getRepoCommits = async (
  accessToken: string,
  ownerName: string,
  repoName: string,
  query: TQuery = {},
) => {
  const octokit = new Octokit({
    auth: accessToken,
  });

  /*
  const { data } = await octokit.request("GET /repos/{owner}/{repo}/commits", {
    owner: ownerName,
    repo: repoName,
    ...query,
  });
  */
  const { data } = await octokit.request("GET /search/commits", {
    q: `author:${ownerName} author-date:2023-01-01..2023-12-31`,
  });

  const myCommits = data.items;

  console.log(myCommits);

  const details = [];
  for (const commit of myCommits) {
    const { sha } = commit;
    const { data } = await octokit.request(
      "GET /repos/{owner}/{repo}/commits/{commit_sha}",
      {
        owner: ownerName,
        repo: repoName,
        commit_sha: sha,
      },
    );
    details.push({
      files: data.files,
      date: data.commit.author.date,
      message: data.commit.message,
      parents: data.parents,
    });
  }

  return details;
};

export const getMyRepoCommits = async (
  accessToken: string,
  userName: string,
) => {
  let pagesRemaining = true;
  let data: any[] = [];
  let count = 1;
  const octokit = new Octokit({
    auth: accessToken,
  });

  while (pagesRemaining) {
    const response = await octokit.request("GET /search/commits", {
      q: `author:${userName} author-date:2023-01-01..2023-12-31`,
      per_page: 100,
      page: count,
    });

    data = [...data, ...response.data.items];

    const linkHeader = response.headers.link;

    pagesRemaining = !!(linkHeader && linkHeader.includes(`rel=\"next\"`));

    if (pagesRemaining) {
      count++;
    }
  }
  console.log(data.length);
  const details = [];
  let remaining = data.length;
  for (const commit of data) {
    console.log(remaining--);
    const { sha, repository } = commit;
    const { data } = await octokit.request(
      "GET /repos/{owner}/{repo}/commits/{commit_sha}",
      {
        owner: repository.full_name.split("/")[0],
        repo: repository.full_name.split("/")[1],
        commit_sha: sha,
      },
    );
    details.push({
      files: data.files,
      date: data.commit.author.date,
      message: data.commit.message,
      parents: data.parents,
    });
  }

  return details;
};

const extensionToLanguage = (extension: string) => {
  const map = {
    ts: "typescript",
    js: "javascript",
    py: "python",
    go: "go",
    java: "java",
    rb: "ruby",
    php: "php",
    html: "html",
    css: "css",
    scss: "scss",
    sass: "sass",
    less: "less",
    tsx: "typescript",
    jsx: "javascript",
    json: "json",
    yml: "yaml",
    yaml: "yaml",
    md: "markdown",
    sh: "shell",
    sql: "sql",
    kt: "kotlin",
    cs: "csharp",
    swift: "swift",
    dart: "dart",
    rs: "rust",
    fs: "fsharp",
    fsx: "fsharp",
    fsi: "fsharp",
    hs: "haskell",
    ex: "elixir",
    exs: "elixir",
    erl: "erlang",
    clj: "clojure",
    cljs: "clojure",
    cljc: "clojure",
    edn: "clojure",
    lua: "lua",
    scala: "scala",
    sc: "scala",
    vue: "vue",
    cpp: "cpp",
    c: "c",
    h: "c",
    m: "objectivec",
    mm: "objectivec",
  };
  return (map as { [key: string]: string })[extension];
};

export const getMost3UsedLanguageInCommit = (commits: any[]) => {
  const languageMap = new Map();
  for (const commit of commits) {
    const { files } = commit;
    for (const file of files) {
      const { filename } = file;
      const extension = filename.split(".").slice(-1)[0];
      const language = extensionToLanguage(extension);
      if (!language) continue;
      if (languageMap.has(language)) {
        languageMap.set(language, languageMap.get(language) + 1);
      } else {
        languageMap.set(language, 1);
      }
    }
  }

  const sorted = [...languageMap.entries()].sort((a, b) => b[1] - a[1]);
  const mostUsedLanguage = sorted.slice(0, 3).map((item) => item[0]);
  return mostUsedLanguage;
};

export const getMostCommitDay = (commits: any[]) => {
  const dayMap = new Map();
  for (const commit of commits) {
    const { date } = commit;
    const day = new Date(date).getDay();
    if (dayMap.has(day)) {
      dayMap.set(day, dayMap.get(day) + 1);
    } else {
      dayMap.set(day, 1);
    }
  }

  const sorted = [...dayMap.entries()].sort((a, b) => b[1] - a[1]);
  const mostCommitDay = sorted[0][0];
  const dayMap2 = new Map([
    [0, "일요일"],
    [1, "월요일"],
    [2, "화요일"],
    [3, "수요일"],
    [4, "목요일"],
    [5, "금요일"],
    [6, "토요일"],
  ]);
  return dayMap2.get(mostCommitDay);
};
