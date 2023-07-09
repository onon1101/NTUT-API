import qs from 'qs';
import axios from 'axios';
import iconv from 'iconv-lite';
import axiosRetry from 'axios-retry';
import { CookieJar } from 'tough-cookie';
import AxiosCookiesSuppert from '../tools/axios_cookies_suppert';

const cookieJar = new CookieJar();

class LoginPage {
  constructor(username, password) {
    this.username = username;
    this.password = password;
    this.Axios = null;
    this.headers = {
      video: {
        Origin: 'https://nportal.ntut.edu.tw',
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.102 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Sec-Fetch-Site': 'same-site',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Dest': 'document',
        Referer: 'https://nportal.ntut.edu.tw/',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      classSchedule: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Upgrade-Insecure-Requests': '1',
        Origin: 'https://nportal.ntut.edu.tw',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.199 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Sec-Fetch-Site': 'same-site',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Dest': 'document',
        Referer: 'https://nportal.ntut.edu.tw/',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': ' zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7',
      },
    };
  }

  login() {
    axiosRetry(
      axios,
      {
        retries: 5,
        shouldResetTimeout: true,
      },
    );
    const result = axios.create({
      headers: this.headers.video,
      withCredentials: true,
      maxBodyLength: Infinity,
      baseURL: 'https://nportal.ntut.edu.tw',
      responseType: 'arraybuffer',
      reponseEncoding: 'binary',
      jar: cookieJar,
    });
    AxiosCookiesSuppert.withCookie(result);
    this.AxiosCookies = result;
    return true;
  }

  async getPortal() {
    try {
      this.login();
      const clawler = this.AxiosCookies;
      const userAccount = qs.stringify({
        muid: this.username,
        mpassword: this.password,
      });
      await clawler.post('login.do', userAccount);
      this.AxiosCookies = clawler;
      return true;
    } catch (error) {
      console.error(error);
      return new Error(error);
    }
  }

  async getCorsClass() {
    try {
      const clawler = this.AxiosCookies;
      const bodyCors = await clawler.get('/ssoIndex.do?apOu=aa_0010-');
      const htmlSplit = await JSON.stringify(iconv.decode(bodyCors.data, 'big5')).split(/['']/);
      const sessionCookie = qs.stringify(
        {
          sessionId: htmlSplit[13],
          reqFrom: htmlSplit[19],
          userid: htmlSplit[25],
          userType: htmlSplit[31],
        },
      );
      clawler.defaults.baseURL = 'https://aps.ntut.edu.tw/';
      clawler.defaults.headers = this.headers.classSchedule;
      await clawler.post('/course/tw/courseSID.jsp', sessionCookie);
      this.AxiosCookies = clawler;
      return true;
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  }

  async getCorsVideo() {
    const clawler = this.AxiosCookies;
    const bodyCors = await clawler.get('/ssoIndex.do?apOu=ischool_plus_&sso=true&datetime1=1582549002044');
    const htmlSplit = JSON.stringify(iconv.decode(bodyCors.data, 'big5')).split(/['']/);
    const sessionCookie = qs.stringify(
      {
        sessionId: htmlSplit[13],
        userID: htmlSplit[19],
        username: htmlSplit[25],
        email: htmlSplit[31],
      },
    );
    clawler.defaults.baseURL = 'https://istudy.ntut.edu.tw/';
    await clawler.get('/login.php', sessionCookie);
    return true;
  }

  async get(...args) {
    return new Promise((resovle, reject) => {
      this.AxiosCookies.get(...args).then((res) => {
        resovle(iconv.decode(res.data, 'big5'));
      }).catch((err) => {
        reject(err);
      });
    });
  }
}

export default LoginPage;
