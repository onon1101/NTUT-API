import cheerio from 'cheerio';
import SingleModule from './getSingle.module';

const main = () => new Promise((resolve, reject) => {
  const url = 'https://aps.ntut.edu.tw/course/tw/QueryCurrPage.jsp';

  // 拿取有近幾年的年份
  SingleModule.GetPage(url)
    .then((response) => {
      const $ = cheerio.load(response);

      const result = {
        years: {},
        current: {
          year: $('select[name="year"] option:selected').text(),
          semester: $('select[name="sem"] option:selected').text(),
        },
      };

      $('select[name="year"] option')
        .map((index, element) => $(element).text())
        .toArray()
        .map((x) => {
          if (x === result.current.year && result.current.semester === 1) {
            result.years[x] = [1];
          } else {
            result.years[x] = [1, 2];
          }
          return null;
        });

      resolve(result);
    })
    .catch((err) => {
      console.log(err);
      reject();
    });
});

export default main;
