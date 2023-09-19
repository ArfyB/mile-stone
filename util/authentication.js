function createUserSession(req, user, action) {     // 로그인한 유저의 세션을 저장하기위해서 사용   --   auth.controller에서 사용
    req.session.uid = user._id.toString();  // session에 uid필드 추가.
    req.session.save(action);   // 해당 작업이 완료되고 실행하려는 동작이 있는경우에 사용
}

function destroyUserAuthSession(req) {
    req.session.uid = null;
}

module.exports = {
    createUserSession: createUserSession,
    destroyUserAuthSession: destroyUserAuthSession
};