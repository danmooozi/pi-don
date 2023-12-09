import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/callback", (req, res) => {
  const result = axios({
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

  res.json(true);
});

export default router;
