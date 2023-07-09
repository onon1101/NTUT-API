import axios from 'axios';
import cheerio from 'cheerio';
import iconv from 'iconv-lite';
import axiosRetry from 'axios-retry';

import pangu from '../tools/pangu';
import singleModule from './getSingle.module';

// 設定重新嘗試次數
axiosRetry(
  axios,
  {
    retries: 5,
  },
);

// class Course {
//   constructor() {
//     this.regexParse = /\n|\s|^ | $/g;
//   }

//   courseDetail($) {
//     const format = (funct) => { funct.text().trim().replace(this.regexParse, ''); };
//     return {
//       code: format($('body > table > tbody > tr:nth-child(2) > td:nth-child(1)')),
//       name: {
//         zh: format($('body > table > tbody > tr:nth-child(2) > td:nth-child(2)')),
//         en: format($('body > table > tbody > tr:nth-child(2) > td:nth-child(3)')),
//       },
//       description: {
//         zh: format($('body > table > tbody > tr:nth-child(3) > td:nth-child(2)')),
//         en: format($('body > table > tbody > tr:nth-child(3) > td:nth-child(3)')),
//       },
//     };
//   }

//   async couresList(url) {
//     const getSinglePage = await singleModule.GetPage(url);
//     const $ = cheerio.load(getSinglePage);

//     // 產生一個課程的詳細資料
//     const response = this.courseDetail($);

//     if (response.name.en === 'Nil') {
//       response.name = { zh: '', en: '' };
//     }
//     return response;
//   }
// }

// 需要排除的字元
const regexParse = /\n|\s|^ | $/g;

// 拿取一個課程的詳細資料
const couresList = async (url = 'https://aps.ntut.edu.tw/course/tw/Curr.jsp?format=-2&code=1400037') => {
  // console.log(await singleModule.GetPage(url));
  const $ = cheerio.load(await singleModule.GetPage(url));
  const response = {
    code: $('body > table > tbody > tr:nth-child(2) > td:nth-child(1)')
      .text().trim().replace(regexParse, ''),
    name: {
      zh: pangu($('body > table > tbody > tr:nth-child(2) > td:nth-child(2)')
        .text().trim().replace(regexParse, '')),
      en: $('body > table > tbody > tr:nth-child(2) > td:nth-child(3)')
        .text().trim().replace(regexParse, ''),
    },
    description: {
      zh: pangu($('body > table > tbody > tr:nth-child(3) > td:nth-child(2)')
        .text().trim().replace(regexParse, '')),
      en: $('body > table > tbody > tr:nth-child(3) > td:nth-child(3)')
        .text().trim().replace(regexParse, ''),
    },
  };
  if (response.name.en === 'Nil') {
    response.name = { zh: '', en: '' };
  }
  return response;
};

// 篩出一個課程的名字, 連結, 課程代碼
const parseLinks = ($, links) => {
  const result = [];
  links.each((index, element) => {
    result.push({
      name: $(element).text().replace(regexParse, ''),
      link: $(element).attr('href'),
      code: $(element).attr('href').match(/code=(\d+)/)[1],
    });
  });
  return result;
};

// 篩出一個課程的教學大綱
const parseSyllabusLinks = ($, links) => {
  const result = [];
  links.each((index, element) => {
    result.push($(element).attr('href'));
  });
  return result;
};

// 篩出一個課程的時間
const parseTime = ($, time) => time.replace(regexParse, '').split(' ').filter((x) => x.length);

// 篩出每一比課程的所有詳細資料
const getCourse = async (matricKey = '日間部', year = '109', semester = 2) => {
  try {
    const matric = {
      日間部: "'1','5','6','7','8','9'",
      進修部: "'4','A','D','C','E','F'",
      '研究所(日間部、進修部、週末碩士班)': "'8','9','A','C','D'",
    };
    const keyword = '';
    const url = `https://aps.ntut.edu.tw/course/tw/QueryCourse.jsp?stime=101%2C102%2C103%2C104%2C122%2C105%2C106%2C107%2C108%2C109%2C110%2C111%2C112%2C113%2C201%2C202%2C203%2C204%2C222%2C205%2C206%2C207%2C208%2C209%2C210%2C211%2C212%2C213%2C301%2C302%2C303%2C304%2C322%2C305%2C306%2C307%2C308%2C309%2C310%2C311%2C312%2C313%2C401%2C402%2C403%2C404%2C422%2C405%2C406%2C407%2C408%2C409%2C410%2C411%2C412%2C413%2C501%2C502%2C503%2C504%2C522%2C505%2C506%2C507%2C508%2C509%2C510%2C511%2C512%2C513%2C601%2C602%2C603%2C604%2C622%2C605%2C606%2C607%2C608%2C609%2C610%2C611%2C612%2C613&year=${year}&matric=${encodeURI(iconv.encode(matric[matricKey], 'big5'))}&sem=${semester}&unit=**&cname=${keyword}&ccode=&tname=&D0=ON&D1=ON&D2=ON&D3=ON&D4=ON&D5=ON&D6=ON&P1=ON&P2=ON&P3=ON&P4=ON&PN=ON&P5=ON&P6=ON&P7=ON&P8=ON&P9=ON&P10=ON&P11=ON&P12=ON&P13=ON&search=%B6%7D%A9l%ACd%B8%DF`;

    console.log(`${new Date()} GET ${url}  start.`);
    const schoolHTML = await singleModule.GetPage(url);
    const $ = cheerio.load(schoolHTML); // 載入 body
    const initialCourseInfo = (val, element) => $($(element).children('td')[val]).text().replace(regexParse, '');

    $('tr:first-child').remove();
    $('tr:last-child').remove();
    $('tr:last-child').remove();
    $('tr:last-child').remove();

    const courseHTML2Json = $('tr').map((index, element) => {
      let notes = initialCourseInfo(21);
      if (notes) {
        notes = pangu(notes);
        if (notes.length === 1) {
          notes = '';
        }
      }
      return {
        id: initialCourseInfo(0, element),
        name: {
          zh: initialCourseInfo(1, element),
          en: null,
        },
        stage: initialCourseInfo(2, element),
        credit: initialCourseInfo(3, element),
        hours: initialCourseInfo(4, element),
        courseType: initialCourseInfo(5, element),
        class: parseLinks($, $($(element).children('td')[6]).children('a')),
        teacher: parseLinks($, $($(element).children('td')[7]).children('a')),
        time: {
          sun: parseTime($, $($(element).children('td')[8]).text().trim()),
          mon: parseTime($, $($(element).children('td')[9]).text().trim()),
          tue: parseTime($, $($(element).children('td')[10]).text().trim()),
          wed: parseTime($, $($(element).children('td')[11]).text().trim()),
          thu: parseTime($, $($(element).children('td')[12]).text().trim()),
          fri: parseTime($, $($(element).children('td')[13]).text().trim()),
          sat: parseTime($, $($(element).children('td')[14]).text().trim()),
        },
        classroom: parseLinks($, $($(element).children('td')[15]).children('a')).map((y) => {
          const newObject = { ...y };
          newObject.name = y.name.replace(/e$|\(e\)$/, '');
          return newObject;
        }),
        people: $($(element).children('td')[16]).text().replace(regexParse, ''),
        peopleWithdraw: $($(element).children('td')[17]).text().replace(regexParse, ''),
        ta: parseLinks($, $($(element).children('td')[18]).children('a')),
        language: $($(element).children('td')[19]).text().replace(regexParse, ''),
        notes,
        courseDescriptionLink: `https://aps.ntut.edu.tw/course/tw/${$($(element).children('td')[1]).children('a').attr('href')}`,
        syllabusLinks: parseSyllabusLinks($, $($(element).children('td')[20]).children('a')),
      };
    }).toArray();

    const result = [];
    // 取得每一個課程的詳細資料
    await courseHTML2Json.reduce(async (total, value, index) => {
      await total;
      const response = await couresList(value.courseDescriptionLink);
      console.log(`${new Date()} GET (${index}/${courseHTML2Json.length}) ${matricKey} - ${response.name.zh} ${value.courseDescriptionLink} finish.`);
      const newValue = { ...value };
      newValue.name.en = response.name.en;
      delete response.name;
      result.push({ ...response, ...newValue });
    });
    return result;
  } catch (err) {
    console.error(err);
    return [];
  }
};

const main = (year, semester, department) => new Promise((resovle) => {
  resovle(getCourse(department, year, semester));
});

export default main;
