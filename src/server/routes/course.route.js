import express from 'express';
import courseCtrl from '../controllers/course.controller';
import paramValidate from '../../config/paramValidate';

const router = express.Router();

router.route('/:year/:semester/:department')
  .get(paramValidate.authCourseSchema, courseCtrl.getCourse);

router.route('/years')
  .get(courseCtrl.getYears);

router.route('/departments')
  .get(courseCtrl.getDepartment);

export default router;
