function getSessionData(req) {
    const sessionData = req.session.flashedData;

    req.session.flashedData = null;

    return sessionData;
}

function flashDataToSession(req, data, action) {
    req.session.flashedData = data; // 로그인 가입 실패시에 기입한 데이터를 보존하기위한 변수
    req.session.save(action);   // 새션패키지 저장 성공시에 action실행

}

module.exports = {
    getSessionData: getSessionData,
    flashDataToSession: flashDataToSession
}