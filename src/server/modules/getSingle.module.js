// getSingle.module.js
import axios from 'axios';
import https from 'https';
import crypto from 'crypto';
import iconv from 'iconv-lite';
import axiosRetry from 'axios-retry';

// 設定重新嘗試次數
axiosRetry(
  axios,
  {
    retries: 5,
    shouldResetTimeout: true,
  },
);

// 同步延遲
const delay = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

// 取得單一頁面的內容
const getSinglePage = (url, retryTimes = 0) => new Promise((resovle, reject) => {
  axios.request({
    method: 'GET',
    url,
    responseType: 'arraybuffer',
    reponseEncoding: 'binary',
    timeout: 10 * 60 * 1000, // 10 minutes
    httpsAgent: new https.Agent({
      secureOptions: crypto.constants.SSL_OP_NO_TLSv1_2,
    }),
  })
    .then((response) => {
      resovle(response);
    })
    .catch(async (error) => {
      if (retryTimes < 10) {
        // eslint-disable-next-line no-plusplus, no-param-reassign
        retryTimes++;
        await delay(1000 * retryTimes * retryTimes);
        getSinglePage(url, retryTimes)
          .then(async (res) => {
            resovle(res);
          })
          .catch((err) => {
            reject(err);
          });
      }
      reject(error);
    });
});

const GetPage = async (url) => {
  await delay(500 + Math.random() * 500);
  return new Promise((resolve, reject) => {
    getSinglePage(url)
      .then(async (res) => {
        // console.log(`${new Date()} GET ${url} success.`);
        resolve(iconv.decode((res.data), 'big5'));
      })
      .catch(async (err) => {
        console.error(`${new Date()} GET ${url} fail. ${err}`);
        reject(err);
      });
  });
};

// console.log(await GetPage('https://aps.ntut.edu.tw/course/tw/Curr.jsp?format=-2&code=1400037'));

export default {
  GetPage,
};
