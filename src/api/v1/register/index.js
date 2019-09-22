const md5 = require('md5');
/**
 * 用户注册表
 */

const userInfo = {
    name: null,
    password: null,
    createTime: Date.now(),
    imgurl: null,
    phone: null,
    email: null,
    qq: null,
    wechat: null,
    age: null,
    city: null,
    country: null,
    address: null,
    uid: null,
    sex: 0,
    limits: 0, // 权限
}


module.exports = function (req, res, config) {
    try {
        ({ 'put': put, 'post': post }[req.method.toLowerCase()])(req, res, config)
    } catch (error) {
        res.error(500)
    }
}




// 更新用户信息
function put(req, res, config) {
    let db = {
        // 获取数据表名称
        table: config.db.table.user,
    }
    res.send('register - put')
}

// 用户注册
function post(req, res, config) {
    let { name, password } = req.body;
    if (!(name && password)) {
        res.info('参数传递有误')
    }
    if (/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(name)) {
        userInfo.name = name;
        userInfo.email = name;
    } else if (/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/.test(name)) {
        userInfo.name = name;
        userInfo.phone = name;
    } else if (/^[\w\d\u4e00-\u9fa5]{3,32}$/.test(name)) {
        userInfo.name = name;
    } else {
        res.info('账号只能是字母、数字、中文、手机号、邮箱');
        return;
    }
    res.Api.db.find({
        table: config.db.table.user,
        find: { name },
    }, (err, data, count) => {
        if (data.length > 1) {
            res.info('该账号已存在，请重新输入')
        } else {
            // 验证密码
            if (name === password) {
                res.info('密码格式不能与用户名相同')
            } else if (!/^[\w\d]{6,32}$/.test(password)) {
                res.info('密码格式不正确，只能是6-32位字母和数字')
                return;
            }
            userInfo.password = md5(password);
            res.Api.db.insert(config.db.table.user, userInfo, (err, data) => {
                if (err) { res.error(500); return };
                res.succress('注册成功')
            })
        }
    })

}