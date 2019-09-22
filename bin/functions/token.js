module.exports = function (req, res, next) {

    // 验证公共请求token
    console.log(__dirname, '验证公共token');
    req.headers.token
    // 验证私密请求token
    if (/(\/user|\/manage)/.test(req.url)) {

        console.log(__dirname, '验证私密token')
    }
    next()
}