import cheerio from 'cheerio';
import cheerioTableParser from 'cheerio-tableparser';
import pangu from '../tools/pangu';
import SingleModule from './getSingle.module';

const regexParse = /\n|^ | $/g;

const arrayRotate = (array) => array[0].map((_, index) => array.map((row) => row[index]));

const getClass = async (page) => new Promise((resolve, reject) => {
  const url = `https://aps.ntut.edu.tw/course/tw/${page}`;
  const result = [];
  SingleModule.GetPage(url)
    .then((response) => {
      const $ = cheerio.load(response);
      $('a').each((index, element) => {
        const classURL = new URL(`https://aps.ntut.edu.tw/course/tw/${$(element).attr('href')}`);
        result.push({
          id: classURL.searchParams.get('code'),
          name: $(element).text(),
          href: $(element).attr('href'),
        });
      });
      resolve(result);
    })
    .catch((err) => reject(err));
});

const main = (year = 110, semester = 2) => new Promise((resolve, reject) => {
  console.log('[fetch] 正在取得系所列表...');
  const url = `https://aps.ntut.edu.tw/course/tw/Subj.jsp?format=-2&year=${year}&sem=${semester}`;
  SingleModule.GetPage(url)
    .then(async (response) => {
      const result = [];
      const $ = cheerio.load(response);

      let solveAsyncProblem = Promise.resolve();
      $('a').each(async (index, element) => {
        solveAsyncProblem = solveAsyncProblem.then(async () => {
          const classA = await getClass($(element).attr('href'));
          result.push({
            name: pangu($(element).text()),
            href: $(element).attr('href'),
            class: classA,
          });
          console.log(`[fetch] 正在取得 (${index}/${$('a').length}) ${result[index].name}`);
          return Promise.resolve();
        });
      });
      solveAsyncProblem.then(() => {
        cheerioTableParser($);
        const DepList = arrayRotate($('table').parsetable(false, true, true));
        DepList.forEach((value) => {
          let college = value[0].replace(regexParse, '');
          if (college === '') {
            college = '校院級';
          }
          value.forEach((value2D, index2D) => {
            if (index2D === 0 || value2D === '' || !value2D) {
              return;
            }
            const c = result.find((x) => x.name === value2D);
            c.category = college;
          });
        });
        resolve(result);
      });
    })
    .catch((err) => {
      console.log(err);
      reject(err);
    });
});
export default main;
