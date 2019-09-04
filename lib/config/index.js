const path = require("path");

const config = {
    root: path.resolve(__dirname, '../../'),
    rootSrc: path.resolve(__dirname, '../../src'),
    server: {
        domain: '0.0.0.0',
        port: 3000,
    },
    db: {
        domain: '127.0.0.1',
        port: '27017',
        username: '',
        password: '',
        dbName: 'test',
    },
    err: {
        404: '404 - 找不到页面',
        500: '500 - 服务器错误'
    },
}


module.exports = config;