const {
    db
} = require('../config');
const MongoClient = require('mongodb').MongoClient;
const url = `mongodb://${db.domain}:${db.port}`;
// Database Name
module.exports = function data(callback) {
    if (typeof callback !== 'function') {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, {
                useUnifiedTopology: true,
                useNewUrlParser: true
            }, function (err, client) {
                if (err) {
                    console.log('连接失败')
                    reject(err);
                } else {
                    console.log('连接成功')
                    resolve(null, client.db(db.dbName));
                    client.close()
                }
            });
        })
    } else {
        MongoClient.connect(url, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        }, function (err, client) {
            if (err) {
                callback(err);
            } else {
                callback(null, client.db(db.dbName))
                client.close()
            }
        });
    }
}