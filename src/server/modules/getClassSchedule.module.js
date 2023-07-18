import cheerio from 'cheerio';
import NTUTRequest from './getLoginPage.module';

const regexParse = /\n|\s|^ | $/g;

class NTUTClassSchedule extends NTUTRequest {
  constructor(username, password) {
    super(username, password);
    this.state = {};
  }

  // 取的課表
  static parseCourseTable(html) {
    const classSchedule = {
      mon: {},
      tue: {},
      wed: {},
      thu: {},
      fri: {},
      sat: {},
      sun: {},
    };
    const $ = cheerio.load(html);
    $('tr:nth-child(-n+2)').remove();

    // 取得'教學大綱'的網址
    const cacheClass = {};
    const totalMsg = $('table:nth-child(n+4) tr:last-child').children('td');
    classSchedule.totalCredit = $(totalMsg).eq(3).text();
    classSchedule.totalHours = $(totalMsg).eq(4).text();

    $('table:nth-child(n+4) tr').each((i, elem) => {
      const name = $(elem).children('td').eq(1).text()
        .replace(regexParse, '');
      cacheClass[name] = {
        id: $(elem).children('td').eq(0).text()
          .replace(regexParse, ''),
        url: $(elem).children('td').eq(19).find('a')
          .attr('href'),
        credit: $(elem).children('td').eq(3).text()
          .replace(regexParse, ''),
        classroom: [],
        teacher: [],
      };
      $(elem).children('td').eq(6).find('a')
        .map((j, elem2) => cacheClass[name].teacher.push($(elem2).text().replace(regexParse, '')));
      $(elem).children('td').eq(15).find('a')
        .map((j, elem2) => cacheClass[name].classroom.push($(elem2).text().replace(regexParse, '')));
    });

    // console.log(cacheClass);
    // 因為網站是以時間為排序條件, 所以需要將她轉換成用日期排序
    // 時間遍遞
    $('table:nth-child(2) tr:nth-child(-n+10)').each((i, elem) => {
      // 日期遍遞
      $(elem).children('td').each((j, elem2) => {
        // 取得當前索引時間
        const time = $(elem).find('th').text().replace(regexParse, '')
          .substring(3);
        // 取得當前索引日期
        const indexDay = Object.keys(classSchedule)[j];
        // 初始化日期
        classSchedule[indexDay][time] = '';
        // 如果該筆資料為空, 代表此時沒有課程
        if ($(elem2).find('a').length > 0) {
          const name = $(elem2).children('a').eq(0).text();
          classSchedule[indexDay][time] = {
            id: cacheClass[name].id,
            name: $(elem2).children('a').eq(0).text(),
            credit: cacheClass[name].credit,
            teacher: cacheClass[name].teacher,
            classroom: cacheClass[name].classroom,
            teacherDetail: `https://aps.ntut.edu.tw/course/tw/${$(elem2).children('a').eq(1).attr('href')}`,
            classSyllabus: `https://aps.ntut.edu.tw/course/tw/${cacheClass[name].url}`,
            classroomDetail: `https://aps.ntut.edu.tw/course/tw/${$(elem2).children('a').eq(2).attr('href')}`,
          };
        }
      });
    });
    return classSchedule;
  }

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

    return NTUTClassSchedule.parseCourseTable(response);
  }

  // async courseID(code, year, semester) {
  //   await this.getPortal();
  //   await this.getCorsClass();

  //   const formRequest = {
  //     format: -3,
  //     code,
  //     year,
  //     sem: semester,
  //   };
  // }
}

const main = () => new Promise((resolve, reject) => {
  const obj = new NTUTClassSchedule(usernae, passwd);
  obj.courseTable(112, 1)
    .then((res) => {
      resolve(res);
    })
    .catch((err) => {
      console.error(err);
      reject(err);
    });
});

export default {
  main,
};
