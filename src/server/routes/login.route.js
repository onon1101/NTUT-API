import express from 'express';
import loginCtrl from '../controllers/login.controller';

const router = express.Router();

router.route('/')
  .post(loginCtrl.postUserAccount);

export default router;
