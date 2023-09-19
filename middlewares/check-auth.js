function checkAuthStatus(req, res, next) {
    const uid = req.session.uid;

    if (!uid) { // 해당 사용자가 이전에 로그인한 적이 없다면
        return next();
    }

    res.locals.uid = uid;
    res.locals.isAuth = true;   //  현재 사용자가 인증되었음
    next();
}

module.exports = checkAuthStatus;