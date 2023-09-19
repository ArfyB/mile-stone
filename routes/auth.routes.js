const express = require('express'); // 각각의 파일에서 필요할 경우 그때마다 로드해야 한다.

const authController = require('../controllers/auth.controller');   // auth.controller.js파일내의 함수를 사용하기위해 호출.

const router = express.Router();

router.get('/signup', authController.getSignup);

router.post('/signup', authController.signup);

router.get('/login', authController.getLogin);

router.post('/login', authController.login);

router.post('/logout', authController.logout);

module.exports = router; // 해당파일의 객체, 함수가 다른 파일에서도 사용이 가능해야 함을 설정.