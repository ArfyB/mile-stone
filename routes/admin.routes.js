const express = require('express'); // 각각의 파일에서 필요할 경우 그때마다 로드해야 한다.

const adminController = require('../controllers/admin.controller');
const imageUploadMiddleware = require('../middlewares/image-upload')

const router = express.Router();

router.get('/products', adminController.getProducts);  // app.use('/admin', adminRoutes); <-- app.js에서의 설정으로 /admin/products가 된다.

router.get('/products/new', adminController.getNewProduct);

router.post('/products', imageUploadMiddleware, adminController.createNewProduct);

module.exports = router; // 해당파일의 객체, 함수가 다른 파일에서도 사용이 가능해야 함을 설정.