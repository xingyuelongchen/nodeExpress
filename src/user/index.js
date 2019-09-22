module.exports = function (req, res, config) {
    try {
        ({ 'get': get, 'post': post, 'delete': del, 'put': put }[req.method.toLowerCase()])(req, res, config)
    } catch (error) {
        res.status(400).send('请求错误')
    }
}
function get(req, res, config) {
    // 用于获取当前已登录用户数据
    res.send('user - get')
}
function post(req, res, config) {
    // 用于提交新注册用户数据
    res.send('user - post')
}
function del(req, res, config) {
    // 用于删除用户
    res.send('user - del')

}
function put(req, res, config) {
    // 用于更新用户信息
    res.send('user - put')
}