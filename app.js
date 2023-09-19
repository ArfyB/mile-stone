const path = require("path");   // view파일경로위해서

const express = require("express"); // expres 패키지 로드
const csrf = require('csurf');  // csrf공격을 막기위한 패키지
const expressSession = require('express-session');

const createSessionConfig = require('./config/session');
const db = require('./data/database');
const addCsrfTokenMiddleWare = require('./middlewares/csrf-token');
const errorHandlerMiddleware = require('./middlewares/error-handler');
const checkAuthStatusMiddleware = require('./middlewares/check-auth');
const authRoutes = require("./routes/auth.routes");
const productsRoutes = require('./routes/products.routes');
const baseRoutes = require('./routes/base.routes');

const app = express(); // express패키지 실행

app.set("view engine", "ejs"); // html화면을 렌더링하는데에 ejs파일을 사용하겠다.
app.set("views", path.join(__dirname, "views")); // 렌더링하는데 필요한 ejs파일의 경로는 __dirname(현재 app.js파일까지의 경로) + views폴더 내의 ejs파일들.

app.use(express.static('public'));  // ejs파일에서 css, js등의 파일에 연결할때에 기본적으로 사용될 루트 (public내의 파일의 경우 모든 html사용자가 접근하여 내용확인이 가능하다.)
app.use(express.urlencoded({ extended: false }));   // 일반 양식 제출만 지원    파라미터등을 통해 요청에 첨부되어 들어오는 7데이터를 이용하기위해 필수.

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));
app.use(csrf());    // get요청이 아닌 모든 요청에 csrf토큰을 부여할 것.

app.use(addCsrfTokenMiddleWare);
app.use(checkAuthStatusMiddleware);

app.use(baseRoutes);
app.use(authRoutes); // 들어오는 모든 요청에 대해서 라우팅이 되고있는지에 대한 검사 (필수)  -- 들어오는 모든 요청을 routes경로 설정한곳의 파일에따라 실행하겠다.
app.use(productsRoutes);

app.use(errorHandlerMiddleware);

db.connectToDatabase().then(function() {    // database에 연결이 성공한다면 app.listen()실행.
    app.listen(3000); // 서버를 3000포트에서 실행하겠다.
}).catch(function(error) {  // database에 연결 실패시에 오류확인
    console.log('Failed to connect to the database!');
    console.log(error);
});