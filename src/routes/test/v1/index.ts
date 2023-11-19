import express from 'express';

const router = express.Router();

router.get('', (_, res) => {
  return res.status(200).json({
    name : 'foo', 
    age : 'bar'
  })
});

export default router;
