import express from 'express';
import courseCtrl from '../controllers/course.controller';

const router = express.Router();

router.route('/')
  .get(courseCtrl.getCourse);

router.route('/years')
  .get(courseCtrl.getYears);

router.route('/departments')
  .get(courseCtrl.getDepartment);
export default router;
