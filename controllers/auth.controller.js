const User = require("../models/user.model");
const authUtil = require("../util/authentication");
const validation = require("../util/validation");
const sessionFlash = require("../util/session-flash");

function getSignup(req, res, next) {
  let sessionData = sessionFlash.getSessionData(req); // sessionData = 로그인, 가입실패시 입력한 데이터 보존을 위한 변수

  if (!sessionData) {
    sessionData={       
      errorMessage: '',
      email: '',
      confirmEmail: '',
      password: '',
      fullname: '',
      street: '',
      postal: '',
      city: ''
    }

  }
  res.render("customer/auth/signup", { inputData: sessionData });
}

async function signup(req, res, next) {

  const enteredData = {
    email: req.body.email,
    confirmEmail: req.body['confirm-email'],
    password: req.body.password,
    fullname: req.body.fullname,
    street: req.body.street,
    postal: req.body.postal,
    city: req.body.city,
  };

  if (
    !validation.userDetailsAreValid(
      req.body.email,
      req.body.password,
      req.body.fullname,
      req.body.street,
      req.body.postal,
      req.body.city
    ) ||
    !validation.emailIsConfirmed(req.body.email, req.body["confirm-email"]) // -가 .표기법으로는 허용되지않기 때문에 대괄호를 이용한다.
  ) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage: "Please check your input",
        ...enteredData, // ...은 객체확산의 효과. {}로 묶여있는 데이터를 각각 하나씩으로 나눠줌
      },
      function () {
        res.redirect("/signup");
      }
    );
    return;
  }

  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.street,
    req.body.postal,
    req.body.city
  );

  try {
    const existsAlready = await user.existsAlready();

    if (existsAlready) {
      sessionFlash.flashDataToSession(
        req,
        {
          errorMessage: "User exists already.",
          ...enteredData,
        },
        function () {
          res.redirect("/signup");
        }
      );
      return;
    }

    await user.signup();
  } catch (error) {
    next(error); //기본오류 미들웨어가 실행되도록 함.
    return;
  }

  res.redirect("/login"); // get요청 /login으로 이동
}

function getLogin(req, res, next) {
  let sessionData = sessionFlash.getSessionData(req);
  
  if (!sessionData) {
    sessionData = {
      errorMessage: '',
      email: '',
      password: ''
    }
  }
  
  res.render("customer/auth/login", { inputData: sessionData });
}

async function login(req, res, next) {
  const user = new User(req.body.email, req.body.password); // 로그인폼에서 입력된 이메일과 비밀번호.

  let existingUser; // try블럭내의 변수를 외부에서 사용하기위함.
  try {
    existingUser = await user.getUserWithSameEmail(); // 위의 이메일로 같은 이메일의 사용자가 있는지 확인후 있다면 existingUser객체에 이메일과 해싱된 비밀번호 추가.
  } catch (error) {
    next(error);
    return;
  }

  const sessionErrorData = {
    errorMessage: "check email, password",
    email: user.email,
    password: user.password,
  };

  if (!existingUser) {
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      res.redirect("/login");
    });
    return;
  }

  const passwordIsCorrect = await user.hasMatchingPassword(
    existingUser.password
  ); // user.model.js  - 기존 데이터베이스에서 같은 이메일을 가진 유저의 저장된 해싱된 비밀번호 전달

  if (!passwordIsCorrect) {
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      res.redirect("/login");
    });
    return;
  }

  authUtil.createUserSession(req, existingUser, function () {
    res.redirect("/");
  });
}

function logout(req, res) {
  authUtil.destroyUserAuthSession(req);
  res.redirect("/login");
}

module.exports = {
  getSignup: getSignup, // 외부 다른파일에서 getSignup이라는 이름으로 function getSignup을 실행하겠다
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout,
};
