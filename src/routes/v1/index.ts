import express from 'express';
import axios from 'axios';
import { getUser } from '@/services/user';
import {
  getUserCommits,
  getUserRepoStars,
  getFriendsCount,
} from '@/services/index';
import { getRepoCommits } from '@/services/commit';

const router = express.Router();

router.get('/callback', async (req, res) => {
  const { code } = req.query;

  const result = await axios({
    method: 'post',
    url: `https://github.com/login/oauth/access_token`,
    headers: {
      accept: 'application/json',
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

router.get('/data', async (req, res) => {
  const { accessToken } = req.query;

  const user = await getUser(accessToken);
  const userName = user.login;

  const commits = await getUserCommits(accessToken, userName, {
    since: '2023-01-01T00:00:00Z',
    until: '2024-01-01T00:00:00Z',
    per_page: 100,
  });

  const starCount = await getUserRepoStars(accessToken, userName);
  const { followerCount, followingCount } = await getFriendsCount(accessToken);

  const mostUsedLanguage = ['JavaScript', 'TypeScript', 'Python']; // string[]
  const moreThan = 'high'; // high, middle, low
  const commitCount = 1234; // number
  const commitDate = '월요일'; // 월요일, 화요일, 수요일, 목요일, 금요일, 토요일, 일요일
  const mostCommunication = {
    // 여기 줄때 github profile 주소도 주면 좋지 않을까 ?
    name: 'bsy1141', // string
    image: 'https://avatars.githubusercontent.com/u/60652298?v=4', // string
  };
  const mbti = 'INFP'; // string

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
    mbti,
  });
});

export default router;
