const express = require('express'); // 각각의 파일에서 필요할 경우 그때마다 로드해야 한다.

const router = express.Router();

router.get('/', function(req, res) {
    res.redirect('/products');
});

module.exports = router; // 해당파일의 객체, 함수가 다른 파일에서도 사용이 가능해야 함을 설정.