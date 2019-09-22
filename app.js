const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = require('./bin/router');
const config = require('./bin/config');
app.listen(config.server.port, config.server.domain, () => {
    console.log('server ', 'http://' + config.server.domain + ':' + config.server.port)
});
// 挂载 请求解析模块
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'text/plain' }));
app.use(bodyParser.json({ type: 'application/json' }));
app.use(express.static('src'));
app.use('/favicon.ico', function () {
    return
})
app.use(router)