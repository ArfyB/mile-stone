function addCsrfToken(req, res, next) {
     res.locals.csrfToken = req.csrfToken();
     next();    // 다음 미들웨어로 요청을 전달
};

module.exports = addCsrfToken;