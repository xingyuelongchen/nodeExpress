const config = require('../config');
const db = require('../database');
const api = require('../functions');
const router = require('express').Router();
const fs = require('fs');
config.api = api();
config.db = db;

// 请求头操作
router.use((req, res, next) => {
    // 跨域设置
    res.header({
        "Access-Control-Allow-Origin": req.headers.origin, // 允许跨域请求的地址
        "Access-Control-Allow-Method": "GET,POST,PUT,DELETE",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
    });
    res.setHeader('charset', 'utf8')
    res.error = function (code, req, error) {
        let text = {
            500: `500 - 处理程序未定义. Server Error: ${error}`,
            403: `403 - 资源未找到. Server Error: ${error}`,
            505: `505 - 数据库出错. Server Error: ${error}`
        }[code]
        this.status(code).send(text)
    }
    next();
})

// 验证请求Token
router.use(config.api.token);

// 挂载 模块 路由
router.all('/*', (req, res, next) => {
    if (fs.existsSync(config.rootSrc + req.url) && fs.existsSync(config.rootSrc + req.url + '/index.js')) {
        
        require(config.rootSrc + req.url)(req, res, config)
    } else {
        next()
    }
});

// 路由不存在
router.all('*', (req, res) => {
    res.status(403).send('请求错误，没有找到对应的处理程序')
})
module.exports = router;

