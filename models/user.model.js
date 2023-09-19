const bcrypt = require('bcryptjs');

const db = require('../data/database');

class User {
  constructor(email, password, fullname, street, postal, city) {    // new User() 함수로 생성하기 위해 필요
    this.email = email; // property를 통해 받은 email값이 생성된 User객체의 email값이다.
    this.password = password;
    this.name = fullname;
    this.address = {
      street: street,
      postalCode: postal,
      city: city,
    };
  }

  getUserWithSameEmail() {
    return db.getDb().collection('users').findOne({ email: this.email });
  };

  async existsAlready() {
    const existingUser = await this.getUserWithSameEmail();
    if (existingUser) {
      return true;
    }
    return false;
  }

  async signup() {
    const hashedPassword = await bccrypt.hash(this.password, 12);    // 비밀번호 암호화.(해싱)

    await db.getDb().collection('users').insertOne({
        email: this.email,
        password: hashedPassword,
        name: this.name,
        address: this.address
    });
  };


  hasMatchingPassword(hashedPassword) {
    return bcrypt.compare(this.password, hashedPassword);   //  (현재 입력된 비밀번호, 기존 데이터베이스에있던 해싱된 비밀번호)
  }
}

module.exports = User;