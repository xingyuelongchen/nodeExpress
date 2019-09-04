const {
    db
} = require('../config');
const MongoClient = require('mongodb').MongoClient;
const url = `mongodb://${db.domain}:${db.port}`;
// Database Name
const dbName = db.database;
module.exports = function data(callback) {
    if (typeof callback !== 'function') {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, {
                useUnifiedTopology: true,
                useNewUrlParser: true
            }, function (err, client) {
                if (err) {
                    reject(err);
                } else {
                    resolve(null, {
                        db: client.db(dbName),
                        close() {
                            client.close()
                            return true;
                        }
                    });
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
                callback(null, {
                    db: client.db(dbName),
                    close() {
                        client.close()
                        return true;
                    }
                });
            }
        });
    }
}