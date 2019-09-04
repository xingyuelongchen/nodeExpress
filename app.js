const config = require('./lib/config');
const express = require('express');
const app = express();
const router = require('./lib/router');
app.listen(config.server.port, config.server.domain, () => {
    console.log('ok')
})
app.use(express.static('src'))
app.use(router)