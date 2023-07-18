import express from 'express';
import PersonalCtrl from '../controllers/Personal.controller';

const router = express.Router();

router.route('/course')
  .get(PersonalCtrl.getPersonalClassSchedule);

export default router;
