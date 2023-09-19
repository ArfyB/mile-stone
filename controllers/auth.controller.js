const User = require("../models/user.model");
const authUtil = require("../util/authentication");
const validation = require("../util/validation");

function getSignup(req, res, next) {
  res.render("customer/auth/signup");
}

async function signup(req, res, next) {
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
    res.redirect("/signup");
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
      res.redirect("/signup");
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
  res.render("customer/auth/login");
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

  if (!existingUser) {
    res.redirect("/login");
    return;
  }

  const passwordIsCorrect = await user.hasMatchingPassword(
    existingUser.password
  ); // user.model.js  - 기존 데이터베이스에서 같은 이메일을 가진 유저의 저장된 해싱된 비밀번호 전달

  if (!passwordIsCorrect) {
    res.redirect("/login");
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
