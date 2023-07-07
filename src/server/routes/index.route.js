import express from 'express';

import course from './course.route';
// import config from '../../config/config';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'this path is /api',
  });
});

router.use('/course', course);

export default router;