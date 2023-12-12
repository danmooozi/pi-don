import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/callback", async (req, res) => {
  const result = await axios({
    method: "post",
    url: `https://github.com/login/oauth/access_token`,
    headers: {
      accept: "application/json",
    },
    data: {
      client_id: Bun.env.CLIENT_ID,
      client_secret: Bun.env.CLIENT_SECRET,
      code: req.body.authorizationCode,
    },
  });

  if (result.data.error) {
    console.log(result.data.error);
    res.json(false);
  }
  res.json(true);
});

router.get("data", async (req, res) => {
  const starCount = 55; // number
  const followerCount = 123; // number
  const followingCount = 223; // number
  const mostUsedLanguage = ["JavaScript", "TypeScript", "Python"]; // string[]
  const moreThan = "high"; // high, middle, low
  const commitCount = 1234; // number
  const commitDate = "월요일"; // 월요일, 화요일, 수요일, 목요일, 금요일, 토요일, 일요일
  const mostCommunication = {
    // 여기 줄때 github profile 주소도 주면 좋지 않을까 ?
    name: "bsy1141", // string
    image: "https://avatars.githubusercontent.com/u/60652298?v=4", // string
  };

  res.json({
    starCount,
    followerCount,
    followingCount,
    mostUsedLanguage,
    moreThan,
    commitCount,
    commitDate,
    mostCommunication,
  });
});

export default router;
