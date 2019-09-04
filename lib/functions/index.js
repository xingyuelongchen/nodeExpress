const config = require('../config');
const fs = require('fs');
const path = require('path');
const md5 = require('md5');
function api(req, res) {
    let root = config.root + '/functions'
    // 自动加载 api 接口文件
    const dirList = fs.readdirSync(root);
    const arr = dirList.map(e => {
        let files = path.resolve(root, e);
        if (fs.statSync(files).isFile()) {
            // 生成接口路由数据
            return {
                path: e.match(/\w+(?=\.)/img)[0].toLowerCase(),
                callback: require(files)
            }
        }
    });

    if (Object.values(req.query).length > 0) {
        if (!!req.query.type) {
            var n = arr.filter(e => {
                if (e.path === req.query.type) {
                    e.callback(req, res);
                    return e;
                }
            });
        }
    }
    if ((!n) || n.length == 0) {
        res.send({ status: 404, message: '请求参数错误' });
    }

}
module.exports = api



