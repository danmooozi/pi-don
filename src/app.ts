import express from 'express';
import middlewares from './app.middlewares';

const app = express();

middlewares.forEach((middleware) => middleware(app));

app.use((_, res) => {
  return res.status(404).send('페이지 낫 파운드');
});

app.listen(Bun.env.SERVER_PORT, () => {
  console.log(`Bun server on : ${Bun.env.SERVER_PORT}`);
});
