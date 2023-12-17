import express from 'express';

const router = express.Router();

router.get('', (_, res) => {
  return res.send('test v2 router');
});

export default router;
