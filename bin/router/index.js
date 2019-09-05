const config = require('../config');
const db = require('../database');
const router = require('express').Router();
const url = require('url');
const fs = require('fs');

config.db = db;
// 请求头操作
router.use((req, res, next) => {
    // token 验证
    console.log(__filename, 'token验证')

    // 跨域设置
    res.header({
        "Access-Control-Allow-Origin": req.headers.origin, // 跨域白名单
        "Access-Control-Allow-Method": "GET,POST,PUT",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
    });
    next();
})
// 挂载 模块 路由
router.all('/*', init);
module.exports = router;

// 查询模块
function _readDir() {
    let dir = [];
    fs.readdirSync(config.rootSrc).forEach(e => {
        if (fs.statSync(config.rootSrc + '/' + e).isDirectory() &&
            fs.existsSync(config.rootSrc + '/' + e + '/index.js') &&
            fs.statSync(config.rootSrc + '/' + e + '/index.js').isFile()) dir.push(e);
    });
    return dir;
}

function init(req, res) {
    let dirArr = _readDir();
    config.pathname = url.parse(req.url).pathname.slice(1).split('/');
    let pathname = config.pathname[0];
    if ((pathname == '' || pathname == 'index') && dirArr.includes('index')) {

        require(config.rootSrc + '/index')(req, res, config);
        return true;
    }

    if ((pathname == '' || pathname == 'index') && fs.existsSync(config.rootSrc + '/index.js')) {
        require(config.rootSrc)(req, res, config);
        return true;
    }

    if (dirArr.includes(pathname)) {
        require(config.rootSrc + '/' + pathname)(req, res, config);
    } else {
        res.status(500).end(config.err['404'])
    };
}