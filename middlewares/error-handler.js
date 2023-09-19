function handleErrors(error, req, res, next) {      // 오류가 생길때 해당 함수 호출.
    console.log(error);
    res.status(500).render('shared/500');
}

module.exports = handleErrors;