import express from "express";
import axios from "axios";
import { getUser } from "@/services/user";
import { getUserRepoStars, getFriendsCount } from "@/services/index";
import {
  getMost3UsedLanguageInCommit,
  getMostCommitDay,
  getMyRepoCommits,
} from "@/services/commit";

const router = express.Router();

router.get("/callback", async (req, res) => {
  const { code } = req.query;

  const result = await axios({
    method: "post",
    url: `https://github.com/login/oauth/access_token`,
    headers: {
      accept: "application/json",
    },
    data: {
      client_id: Bun.env.CLIENT_ID,
      client_secret: Bun.env.CLIENT_SECRET,
      code,
    },
  });
  console.log(result.data);
  if (result.data.error) {
    console.log(result.data.error);
    res.json(false);
    return;
  }
  res.json(true);
});

router.get("/data", async (req, res) => {
  const { accessToken } = req.query;

  if (!accessToken) {
    // 401 error
    res.status(401).json({
      message: "accessToken이 없습니다.",
    });
    return;
  }

  if (typeof accessToken !== "string") {
    // 400 error
    res.status(400).json({
      message: "accessToken의 타입이 올바르지 않습니다.",
    });
    return;
  }

  const user = await getUser(accessToken);
  const userName = user.login;
  const profileImage = user.avatar_url;

  const commits = await getMyRepoCommits(accessToken, userName);

  const { followerCount, followingCount } = await getFriendsCount(accessToken);
  const starCount = await getUserRepoStars(accessToken, userName);
  const repoCount = user.public_repos.length;

  const mostUsedLanguage = getMost3UsedLanguageInCommit(commits);
  let over3DayCommit = 0;
  let MaxContinuousCommit = 0;
  let continuousCommit = 0;
  let continueCommit = false;
  let lastCommitDate = new Date("2023-01-01T00:00:00Z");
  let commitMessageAverageLength = 0;
  let commitMessageLegth = 0;
  let readmeLength = 0;
  let readmeAverageLength = 0;

  commits.forEach((commit) => {
    const date = new Date(commit.date);
    commitMessageLegth += commit.message.length;
    commit.files.forEach(
      (file: { filename: string | string[]; patch: string | any[] }) => {
        if (file.filename.includes("README.md")) {
          readmeLength += file.patch.length;
        }
      },
    );

    // 1일 안에 커밋이 있어야함
    if (lastCommitDate.getTime() - date.getTime() < 86400000) {
      continuousCommit++;
      if (continuousCommit > 3 && !continueCommit) {
        over3DayCommit++;
        continueCommit = true;
      }
      if (continuousCommit > MaxContinuousCommit) {
        MaxContinuousCommit = continuousCommit;
      }
    } else {
      continuousCommit = 0;
      continueCommit = false;
    }
  });
  commitMessageAverageLength = commitMessageLegth / (commits.length || 1);
  readmeAverageLength = readmeLength / (commits.length || 1);

  let moreThan = "high";
  const commitCount = commits.length; // number
  if (commitCount > 100) moreThan = "high";
  else if (commitCount > 50) moreThan = "middle";
  else moreThan = "low";

  const mostCommitDay = getMostCommitDay(commits);
  const commitDate = mostCommitDay; // 월요일, 화요일, 수요일, 목요일, 금요일, 토요일, 일요일
  const mostCommunication = {
    // 여기 줄때 github profile 주소도 주면 좋지 않을까 ?
    name: "bsy1141", // string
    image: "https://avatars.githubusercontent.com/u/60652298?v=4", // string
  };

  const IandE = followerCount + followingCount + starCount < 100 ? "I" : "E";
  console.log("IandE", followerCount, followingCount, starCount);
  /*
  - **I / E 의 구분**
    - 팔로워, 팔로잉, 개인 소유 레포의 스타 갯수, org많은 사람
    */

  const SandN = repoCount + readmeAverageLength < 200 ? "S" : "N";
  console.log("SandN", repoCount);
  /*
- **S / N 의 구분**
    - 레포가 많은 경우 N
    - N의 경우엔 이것저것 상상해보고 뭐 많이 해보려고 해서 일단 레포를 팔 수 있음
    - 자기 Readme나 레포 이름 등에 미래를 나타내는 단어가 있는 경우 N
    */

  const TandF = profileImage * commitMessageAverageLength < 100 ? "T" : "F";
  console.log("TandF", profileImage, commitMessageAverageLength);
  /*
- **T / F 의 구분**
    - 커밋에 포함된 글자수로 확인할 수 있을 것 같아요!
    - PR 리뷰 글자수는 힘들겠죠? PR 리뷰 글자수도 좋은데..
    - 자기 Readme에 감정을 나타내는 이모티콘이 있는 경우 F
    - 프사가 사람 사진일 경우 F
    - T들은 로봇이니까 사람 사진 아닐듯 ㅎ
    - 프사 있/없 = F/T

    */

  const PandJ = over3DayCommit * MaxContinuousCommit < 100 ? "P" : "J";
  console.log("PandJ", over3DayCommit, MaxContinuousCommit);
  /*
- **J / P 의 구분**
    - 커밋 기준으로 일당 커밋으로 표준 편차를 구해서 분표가 넓은 지에 대해서 구분
    - 하루에 커밋을 10회 이상 하고 n일동안 커밋 기록이 없는 사람 = P유형 / 당신은 개발을 몰아서 하는 스타일이군요
    - 한달동안 매일 1일 1커밋 이상 한 사람 = J유형 / 당신은 개발을 꾸준히 하는 스타일이군요
  */

  const MBTI = IandE + SandN + TandF + PandJ;

  res.json({
    commits,
    starCount,
    followerCount,
    followingCount,
    mostUsedLanguage,
    moreThan,
    commitCount,
    commitDate,
    mostCommunication,
    MBTI,
  });
});

export default router;
