# WARNING: this is a test version, please do not use it in your computer, it will release in 2023/08/01.

## Introduce
這是一個以爬蟲為基礎的北科網頁API, 其主要由掃描後回傳結果至網頁上, 並且以json格式回傳
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


## 使用方法
以下分為兩種安裝方式, 一種是使用docker, 另一種是直接安裝在本機上

```bash
npm install
npm run start
```

## 詳細文檔
[如何使用](./docs/how-to-use.md)
