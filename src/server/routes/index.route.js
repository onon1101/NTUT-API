import express from 'express';

import login from './login.route';
import course from './course.route';
import personal from './personal.route';
// import config from '../../config/config';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'this path is /api',
  });
});

router.use('/login', login);
router.use('/course', course);
router.use('/personal', personal);
export default router;
