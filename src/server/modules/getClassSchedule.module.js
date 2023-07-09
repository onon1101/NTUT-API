import qs from 'qs';
import cheerio from 'cheerio';
import NTUTRequest from './getLoginPage.module';

const regexParse = /\n|\s|^ | $/g;

class NTUTClassSchedule extends NTUTRequest {
  constructor(username, password) {
    super(username, password);
    this.state = {};
  }

  parseCourseTable(html) {
    const $ = cheerio.load(html);
    $('tr:nth-child(-n+2)').remove();

    // 取得課表詳細資料的網址
    const cacheClass = {};
    $('table:nth-child(n+4) tr').each((i, elem) => {
      const name = $(elem).children('td').eq(1).text()
        .replace(regexParse, '');
      const url = $(elem).children('td').eq(19).find('a')
        .attr('href');
      cacheClass[name] = url;
    });

    const a = {
      mon: {
        '8:10-9:00': {},
        '9:10-10:00': {},
        '10:10-11:00': {},
        '11:10-12:00': {},
        '12:10-13:00': {},
        '13:10-14:00': {},
        '14:10-15:00': {},
        '15:10-16:00': {},
        '16:10-17:00': {},
        '17:10-18:00': {},
      },
      tue: {
        '8:10-9:00': {},
        '9:10-10:00': {},
        '10:10-11:00': {},
        '11:10-12:00': {},
        '12:10-13:00': {},
        '13:10-14:00': {},
        '14:10-15:00': {},
        '15:10-16:00': {},
        '16:10-17:00': {},
        '17:10-18:00': {},
      },
      wed: {
        '8:10-9:00': {},
        '9:10-10:00': {},
        '10:10-11:00': {},
        '11:10-12:00': {},
        '12:10-13:00': {},
        '13:10-14:00': {},
        '14:10-15:00': {},
        '15:10-16:00': {},
        '16:10-17:00': {},
        '17:10-18:00': {},
      },
      thu: {
        '8:10-9:00': {},
        '9:10-10:00': {},
        '10:10-11:00': {},
        '11:10-12:00': {},
        '12:10-13:00': {},
        '13:10-14:00': {},
        '14:10-15:00': {},
        '15:10-16:00': {},
        '16:10-17:00': {},
        '17:10-18:00': {},
      },
      fri: {
        '8:10-9:00': {},
        '9:10-10:00': {},
        '10:10-11:00': {},
        '11:10-12:00': {},
        '12:10-13:00': {},
        '13:10-14:00': {},
        '14:10-15:00': {},
        '15:10-16:00': {},
        '16:10-17:00': {},
        '17:10-18:00': {},
      },
    };
    console.log(cacheClass);
    console.log(cacheClass['線性代數']);
    const b = ['mon', 'tue', 'wed', 'thu', 'fri'];
    $('table:nth-child(2) tr:nth-child(-n+10)').each((i, elem) => {
      $(elem).children('td').each((j, elem2) => {
        if ($(elem2).find('a').length > 0) {
          const temp = $(elem).find('th').text().replace(regexParse, '')
            .substring(3);

          a[b[j]][temp] = {
            name: $(elem2).children('a').eq(0).text(),
            teacher: $(elem2).children('a').eq(1).text(),
            classroom: $(elem2).children('a').eq(2).text(),
            classDetail: cacheClass[$(elem2).children('a').eq(0).text()],
            teacherDetail: $(elem2).children('a').eq(1).attr('href'),
            classroomDetail: $(elem2).children('a').eq(2).attr('href'),
          };
          console.log(a[b[j]][temp]);
        }
      });
    });
    return a;
  }

  // getClassDetail = memoize($, classname);

  async courseTable(year, semester) {
    // login in to portal and get into CORS
    await this.getPortal();
    await this.getCorsClass();

    const formRequest = {
      format: -2,
      code: this.username,
      year,
      sem: semester,
    };

    const response = await this.get(
      `https://aps.ntut.edu.tw/course/tw/Select.jsp?format=-2&code=${this.username}&year=${year}&sem=${semester}`,
      formRequest,
    );

    return this.parseCourseTable(response);
  }

  // async courseID(year, semester) {

  // }
}

const main = async () => {
  const a = new NTUTClassSchedule(, );
  const b = await a.courseTable(112, 1);
  console.log(b);
};

await main();

export default main;
