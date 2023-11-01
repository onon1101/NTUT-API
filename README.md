

## Introduce
這是一個以爬蟲為基礎的北科網頁API, 其主要由掃描後回傳結果至網頁上, 並且以json格式回傳

## 使用方法
以下分為兩種安裝方式, 一種是使用docker, 另一種是 source code

### Source Code
```bash
git clone http://github.com/onon1101/NTUT-API
cd ./NTUT-API
npm install
npm run build
npm run start
```

### Docker
```bash
docker run -it -d -p3000:3000 --name ntutapi onon1101/ntutapi
```

## 詳細文檔
[詳細說明](./docs/how-to-use.md) <br>
[API 路徑](./docs/API-Path.md) <br>
[安裝詳細說明](./docs/)

```txt
NTUT-API
|-- docs
  |-- how-to-use.md
|-- dist
  |-- index.bundle.js
  |-- index.bundle.js.map
|-- src
  |-- config
    |-- config.js
    |-- express.js
    |-- paramValidate.js
  |-- server
    |-- controllers
    |-- helpers
    |-- modules
    |-- routes
    |-- tools
  |-- index.js // 程序入口
```

## 預設設定
所有預設設定都於 `.env` 中,
網頁將於 `http://localhost:3000`
