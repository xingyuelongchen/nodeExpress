const md5 = require('md5');
/**
 * 用户注册表
 */

const userInfo = {
    name: {
        required: true
    },
    password: {
        required: true,
        type: /^[\w\d]{6,32}$/,
        message: '密码不符合规则'
    },
    createTime: {
        required: true,
        type: Date,
        default: Date.now()
    },
    imgurl: null,
    phone: null,
    email: 'email',
    qq: null,
    wechat: null,
    age: null,
    city: null,
    country: null,
    address: null,
    uid: null,
    sex: 0,
    limits: Array, // 权限
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

    let isError = res.ApiExp({ name, password }, userInfo)
    if (isError.error) {
        res.info(isError.message);
        return;
    }
    if (!(name && password)) {
        res.info('参数传递有误')
    }
    if (!res.ApiExp(name, 'email').error) {
        userInfo.name = name;
        userInfo.email = name;
    } else if (!res.ApiExp(name, 'phone').error) {
        userInfo.name = name;
        userInfo.phone = name;
    } else if (/^[\w\d\u4e00-\u9fa5]{3,32}$/.test(name)) {
        userInfo.name = name;
    } else {
        res.info('账号只能是字母、数字、中文、手机号、邮箱');
        return error;
    }
    res.ApiDb.find({
        table: config.db.table.user,
        find: { name },
    }, (err, data, count) => {
        if (data.length > 1) {
            res.info('该账号已存在，请重新输入')
        } else {
            // 验证密码
            if (name === password) {
                res.info('密码格式不能与用户名相同')
            } else if (res.ApiExp(password, /^[\w\d]{6,32}$/).error) {
                res.info('密码格式不正确，只能是6-32位字母和数字')
                return error;
            }
            userInfo.password = md5(password);
            res.ApiDb.insert(config.db.table.user, userInfo, (err, data) => {
                if (err) { res.error(500); return error };
                res.succress('注册成功')
            })
        }
    })

}