const url = require('url')
module.exports = function (req, res, config) {

    try {
        ({ 'post': post, 'get': get }[req.method.toLowerCase()])(req, res, config)
    } catch (error) {
        console.log(error)
        res.info('请求错误')
    }
}
// 退出登录
function get(req, res, config) {

    let token = req.headers.cookie || req.cookies
    token ? token = token.replace(/^.*=/, '') : '';
    if (token && req.headers.uid_id !== token) {
        res.info('Headers的uid_id参数错误');
        return;
    }
    res.clearCookie("uid_id");
    res.ApiDb.del({
        table: config.db.table.uid_id,
        find: { token }
    }, (err, d) => {
        if (!err) {
            res.succress('退出登录')
        } else {
            res.error(500)
        }
    })

}
// 请求登陆
function post(req, res, config) {
    let { name, password } = req.body;
    if (!(name && password)) {
        res.info('参数传递有误')
    }
    let find = {
        table: 'user',
        find: { $or: [{ name }, { phone: name }, { email: name }] }
    }
    console.log(res.ApiDb)
    res.ApiDb.find(find, (err, d, count) => {
        if (d.length > 0 && d[0].password == res.ApiMD5(password)) {
            let token = res.ApiMD5(res.ApiMD5(d[0].password) + res.ApiMD5(d[0]._id));
            // 不返回敏感信息
            delete d[0].password;
            let user = d[0];

            // 生成token
            user.uid_id = token
            let data = {
                domain: req.headers.host,
                token,
                maxAge: Date.now() + 7 * 24 * 60 * 60 * 1000,
                user,
            }
            res.userInfo = user;
            // 向客户端添加token
            res.cookie('uid_id', token, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true });

            // 查询当前账户是否已有token信息
            res.ApiDb.find({ table: config.db.table.uid_id, token }, (err, e) => {
                if (err) {
                    res.info('登陆失败')
                    return
                }
                // 未登录，添加当前token
                if (e.length == 0) {
                    res.ApiDb.insert(config.db.table.uid_id, data, (err, data) => {
                        res.succress({ message: '登陆成功', content: user, log: { type: 'login', message: '账户登陆' } })
                    })
                }
                // 已登录，更新token
                if (e.length > 0) {
                    let option = {
                        table: config.db.table.uid_id,
                        find: { token },
                        value: data
                    }
                    res.ApiDb.update(option, (err, data) => {
                        if (err) {
                            res.error(500);
                        } else {
                            res.succress({ message: '登陆成功', content: user, log: { type: 'login', message: '账户登陆' } })
                        }
                    })
                }
            })
        } else {
            res.info('登陆失败')
        }

    })
}