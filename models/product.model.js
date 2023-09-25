const db = require('../data/database');

class Product{  // 객체를 생성할 수 있게 도와주는 청사진.
    constructor(productData) {
        this.title = productData.title;
        this.summary = productData.summary;
        this.price = +productData.price;    // 숫자로 저장하기 위해서 +추가
        this.description = productData.description;
        this.image = productData.image; // 이미지 파일의 이름.
        this.imagePath = `product-data.images/${productData.image}` // 이미지파일이 저장된 백엔드에서의 경로
        this.imageUrl = `/products/assets/images/${productData.image}`; // 이미지파일이 저장된 프론트에서의 경로
        if (productData._id) {  // id데이터 없이 제품을 만들때 오류가 생기지 않음
            this.id = productData._id.toString();
        }
    }

    static async findAll() {    // static = 정적 메서드. 인스턴트화할 필요가 없음.  ==   Product객체를 만든후에 Product.findAll()이라고 사용할 필요가 없음
        const products = await db.getDb().collection('products').find().toArray();  // toArray()를 이용하여 배열로 변환해 주었음.

        // 자바스크립트의 모든 배열에서는 map메소드를 호출 가능
        // 해당 변환을 통해서 imageUrl속성이 존재하도록 함
        return products.map(function(productDocument) { // 해당 배열의 모든 항목에 대해 자바스크립트로 실행
            return new Product(productDocument);    // imagePath, Url 제작
        })
    }

    async save() {
        const productData = {
            title: this.title,
            summary: this.summary,
            price: this.price,
            description: this.description,
            image: this.image   // 이미지의 이름만 저장함으로써 imagePath, imageUrl의 경로가 변경되었을때의 유동성을 부여한다.
        }

        await db.getDb().collection('products').insertOne(productData);
    }
}

module.exports = Product;