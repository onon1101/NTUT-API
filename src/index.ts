import qs from 'qs';
import cheerio from 'cheerio';
import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';

import { spider } from './module/spiderMod';


const cookieJar = new CookieJar();
const userAccount: String = qs.stringify({
    'muid': username,
    'mpassword': password
});

const ntutPackage: AxiosInstance = axios.create({
    baseURL: 'https://nportal.ntut.edu.tw/',
    maxBodyLength: Infinity,
    withCredentials: true,
    jar: cookieJar,
    headers: {
        'Origin': 'https://nportal.ntut.edu.tw',
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.102 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Sec-Fetch-Site': 'same-site',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Dest': 'document',
        'Referer': 'https://nportal.ntut.edu.tw/',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'close'
    },
});

wrapper(ntutPackage);

function main() {

    const getData = async () => {
        try {

            await ntutPackage.post('login.do', userAccount);

            let getPortal = await ntutPackage.get('ssoIndex.do?apOu=ischool_plus_&sso=true&datetime1=1582549002044');
            let sessionCookie = qs.stringify(spider.getSessionCookie(getPortal.data));

            // 開始跨域請求
            ntutPackage.defaults.baseURL = 'https://istudy.ntut.edu.tw/';
            await ntutPackage.post('login.php', sessionCookie);
            // console.log(spider.getCourseList((await ntutPackage.get('learn/mooc_sysbar.php')).data));

            
            let courseIdx = `<manifest><ticket/><course_id>10086609</course_id><env/></manifest>`;

            await ntutPackage.post('learn/goto_course.php', courseIdx);
            let courseID = spider.getCID((await ntutPackage.get('learn/path/launch.php')).data);
            
            let fileInfo = spider.getFileInfo((await ntutPackage.get(`learn/path/pathtree.php?cid=${courseID}`)).data);
            let filename = spider.getFileName((await ntutPackage.get('https://istudy.ntut.edu.tw/learn/path/SCORM_loadCA.php')).data);
            // console.log(qs.stringify(fileInfo));
            fileInfo['href'] = `@${filename[0].value}`;
            
            console.log(fileInfo);
            let getVideo = await ntutPackage.post('/learn/path/SCORM_fetchResource.php', fileInfo);
            console.log(getVideo.data);
            
        }
        catch (error) {
            // console.log(error);
        }
    };
    getData();
};
main()