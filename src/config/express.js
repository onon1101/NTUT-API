import cors from 'cors';
import morgan from 'morgan';
import express from 'express';

import routes from '../server/routes/index.route';

const app = express();

// request 的內容轉換成 json 格式
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// 跨域處理
app.use(cors());

// 記錄每一次請求的 log
app.use(morgan('dev'));

// 設定路由
app.get('/', (req, res) => {
  res.json({
    message: 'Hello World!',
  });
});

app.use('/api', routes);

export default app;
