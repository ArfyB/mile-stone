const multer = require("multer");
const uuid = require("uuid").v4;  // 업로드하는 이미지에 고유한 id를 부여하여 동일한시간에 업로드하여도 각각의 이미지를 분별하기 위함.

const upload = multer({
  storage: multer.diskStorage({
    destination: "product-data/images", // 실제 이미지파일이 저장될 경로
    filename: function (req, file, cb) {
      cb(null, uuid() + "-" + file.originalname);   //  cb(잠재적오류, '패키지를이용한 고유한id-원래파일이름')
    },
  }),
});

const configuredMulterMiddleware = upload.single("image"); // single메소드를 사용하여 들어오는 요청에서 필드이름으로 단일파일을 추출   (image가 input필드의 name)

module.exports = configuredMulterMiddleware;
