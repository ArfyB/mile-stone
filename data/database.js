const mongodb = require("mongodb"); // mongodb패키지 로드

const MongoClient = mongodb.MongoClient;

let database;

async function connectToDatabase() {    // mongodb에 연결
  const client = await MongoClient.connect("mongodb://localhost:27017");  // 27017은 mongodb에 연결하기위한 기본적인 포트
  database = client.db('online-shop');  // mongodb에서 database이름 online-shop에 연결. (기존에 없었다면 새롭게 생성됨)
}

function getDb() {
    if (!database) {       // 혹시라도 db에 연결되지 않았을때를 대비한 검사
        throw new Error('You must connect first!');
    }
    return database;
}

module.exports = {
    connectToDatabase: connectToDatabase,
    getDb: getDb
}