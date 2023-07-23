# 說明
以下是NTUT API的路徑, 而此API的路徑模式可以分為兩類. 一種是不需要登入即可獲取到資料的路徑, 另外一種是需要先[登入](./API-Path#login), 再來您將獲取到一個 token, 最後即可使用此 token 訪問其他路徑

```txt
NTUT-API
|-- 不需要 登入
    |-- /api/course/*
|-- 需要 登入
    |-- /api/login
    |-- /api/person/
```

# Path
以下為API的路徑.
範例... 假設您伺服器架設於本地端, 那麼如果您要訪問`/api/course/years`的路徑就為:
`localhost:3000/api/course/years()`


### /api/course/years
> 資料庫中所有年級的範圍

### /api/course/departments
> 取得各系所開辦之課程, 及其課程代碼

### /api/course/{學年}/{學期}/{部門}
> 取得該學年學期該系所的課程資訊

部門有三個選項：日間部, 夜間部
ex: /api/course/109/1/日間部


### /api/login
> 登入介面

輸入： 
  - 格式：json
  - 要求：
    - username : 北科的學號
    - password : 北科的密碼
  - 範例:
  ```json
    {
      "username": "1115900xx",
      "password": "abcd"
    }
  ```

輸出：``
  - 格式： string
  - 範例：
  ```txt
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjExMTU5MDB4eCIsImlhdCI6MTY5MDEzMDU5OCwiZXhwIjoxNjkwMTkwNTk4fQ.sTzMTXHv83F7U3zJ7cAo8gpoVnhq1RSXzFmP4WmWjOE"
  ```
![](./postman-1.png)
