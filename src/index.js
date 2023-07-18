import app from './config/express';
import config from './config/config';

const NowTime = new Date();

app.listen(config.port, () => {
  console.log(`Server started on url http://localhost:${config.port}`);
});

console.log(`NowTime: ${NowTime}`);
export default {
  NowTime,
  app,
};
