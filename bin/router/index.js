const config = require('../config');
const db = require('../database');
const api = require('../functions');
const router = require('express').Router();
const fs = require('fs');
const md5 = require('md5');

// 请求头操作
router.use((req, res, next) => {


    // 跨域设置
    res.header({
        "Access-Control-Allow-Origin": req.headers.origin, // 允许跨域请求的地址
        "Access-Control-Allow-Method": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept,token",
        "Access-Control-Max-Age": '10000'
    });
    // 预检请求返回
    if (req.method.toLowerCase() == 'options') {
        res.send(200);
        return;
    }
    for (let k in api) {
        res[k] = api[k];
    }
    res.ApiMD5 = md5;
    res.setlog = function (data) {
        return this.ApiLog.setlog.bind(this)(req, data)
    }
    res.error = function (code) {
        let text = config.error[code]
        this.status(code).send({ code, message: text })
    }
    res.info = function (data) {
        if (data.log) {
            this.setlog(data.log).then(e => {
                typeof data == 'object' ? data = { ...data } : '';
                delete data.log;
                this.status(400).send({ code: 400, message: data })
            }).catch(e => {
                console.log(err);
                console.log('Error: ', __dirname);
                typeof data == 'object' ? data = { ...data } : '';
                delete data.log;
                this.status(400).send({ code: 400, message: data, log: '日志记录写入失败' })
            });
        } else {
            this.status(400).send({ code: 400, message: data })
        }
    }
    res.succress = function (data) {
        if (data.log) {
            this.setlog(data.log).then(e => {
                typeof data == 'object' ? data = { ...data } : '';
                delete data.log;
                this.status(200).send({ code: 200, message: 'ok', data })
            }).catch(err => {
                console.log(err);
                console.error('Error: ', __dirname);
                delete data.log;
                typeof data == 'object' ? data = { ...data } : '';
                this.status(200).send({ code: 200, message: '请求处理完成，日志记录写入失败', data })
            })
        } else {
            typeof data == 'object' ? data = { ...data } : '';
            this.status(200).send({ code: 200, message: 'ok', data })
        }
    }
    next();
})

// 验证请求Token
router.use(token);

router.use('*', (req, res, next) => {
    let body = {
        Files: req.files,
        ...req.fields,
    }
    req.body = body;
    next();
})

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
function token(req, res, next) {
    // 验证公共请求token
    if (req.headers.token !== 'token') {
        console.log('******************')
        res.error(501);
        return;
    }
    // 验证私密请求token
    if (/(\/user|\/manage)/.test(req.url)) {
        res.ApiDb.find({
            table: config.db.table.uid_id,
            find: { token: req.headers.uid_id }
        }, (err, data) => {
            if (!err && data.length > 0 && data[0].maxAge > Date.now()) {
                if (data[0].maxAge < (Date.now() + 4 * 24 * 60 * 60 * 1000)) {
                    res.ApiDb.update({
                        table: config.db.table.uid_id,
                        find: { token: req.headers.uid_id },
                        value: { maxAge: Date.now() + 24 * 7 * 60 * 60 * 1000 }
                    })
                }
                res.userInfo = data.user
                next()
            } else {
                res.info('uid_id验证不通过')
                return
            }
        })
    } else {
        next()
    }

}
