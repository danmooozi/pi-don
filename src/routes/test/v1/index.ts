import express from 'express';

const router = express.Router();

router.get('', (_, res) => {
  return res.send('test router');
});

export default router;
