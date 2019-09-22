module.exports = function (req, res, config) {
    try {
        ({ 'get': get, 'post': post, 'delete': del, 'put': put }[req.method.toLowerCase()])(req, res, config)
    } catch (error) {
        res.error(500, req, error)
    }
}
function get(req, res, config) {
    res.send('login - get')
}
function post(req, res, config) {
    console.log(req.headers)
    res.send(req.headers)
}
function del(req, res, config) {
    res.send('login - del')

}
function put(req, res, config) {
    res.send('login - put')
}