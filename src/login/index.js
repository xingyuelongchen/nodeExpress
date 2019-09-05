module.exports = function (req, res, obj) {
    if (req.method.toLowerCase() == 'get') {
        loginGet(req, res, obj)
        return true;
    }
    if (req.method.toLowerCase() == 'post') {
        loginPost(req, res, obj)
        return true;
    }
    res.status(403).send('请求类型错误')
}
function loginGet(req, res, obj) {
    // 返回登陆注册页面
    res.status(200).send('ok')
}
function loginPost(req, res, obj) {
    // 登陆注册请求接口数据
    res.status(200).send('ok')

}