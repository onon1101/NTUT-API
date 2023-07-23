import mysql from 'mysql';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config/config';
import NTUTRequest from '../modules/getLoginPage.module';

// const connectionPool = mysql.createPool({
//   connectionlimit: 10,
//   host: config.mysqlHost,
//   user: config.mysqlUser,
//   password: 'Qazxsw123@',
//   database: 'Community',
// });
const connectionPool = mysql.createPool({
  connectionlimit: 10,
  host: config.mysqlHost,
  user: config.mysqlUser,
  password: config.mysqlPass,
  database: config.mysqlDatabase,
});

const createUser = (insertValues) => new Promise((resovle, reject) => {
  connectionPool.getConnection((connectionError, connection) => {
    if (connectionError) {
      reject(connectionError);
    } else {
      connection.query('INSERT INTO users SET ?', insertValues, (error, result) => {
        if (error) {
          console.error('SQL error:', error);
          reject(error);
        } else if (result.affectedRows === 1) {
          resovle(`新增成功！ article_id: ${result.insertId}`);
        }
      });
      connection.release();
    }
  });
});

// 製造一個 token 使其方便溝通
const createToken = (timeout, username) => {
  const SECRET = 'my_script';
  const payload = {
    username,
  };
  return jwt.sign(
    payload,
    SECRET,
    {
      expiresIn: timeout,
    },
  );
};

// 在北科網頁中, 是否此筆資料存在於北科資料庫中
const isExist = async (username, password) => new Promise((resolve, reject) => {
  (async () => {
    try {
      const loginNTUTPortal = await new NTUTRequest(username, password);
      loginNTUTPortal.getPortal();
      resolve('登入成功!');
    } catch (err) {
      reject(err);
    }
  })();
});

class Login {
  constructor() {
    this.timeout = 60 * 1000; // 60s
  }

  newUser(userData) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          // bug
          await isExist(userData.username, userData.password);

          const encryData = {
            username: userData.username,
            password: bcrypt.hashSync(userData.password, 10),
            token: createToken(this.timeout, userData.username),
          };

          await createUser(encryData); // 將使用者資料存進去 database 裏面

          // 把token丟給客戶端, 讓之後的溝通都用token 解決
          resolve(encryData.token);
        } catch (err) {
          reject(err);
        }
      })();
    });
  }
}

const loginUserAccount = (insertValues) => new Promise((resolve, reject) => {
  const obj = new Login();
  obj.newUser(insertValues)
    .then((response) => {
      resolve(response);
    })
    .catch((err) => {
      reject(err);
    });
});

// loginUserAccount({
//   username: '111590009',
//   password: 'abcd',
// })
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.error(err);
//   });

export default {
  loginUserAccount,
};
