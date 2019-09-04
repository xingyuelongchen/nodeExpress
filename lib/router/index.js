const config = require('../config');
const db = require('../db');
const router = require('express').Router();
const url = require('url');
const fs = require('fs');
router.all('/*', init);
module.exports = router;

function _readDir() {
    let dir = [];
    fs.readdirSync(config.rootSrc).forEach(e => {
        if (fs.statSync(config.rootSrc + '/' + e).isDirectory() &&
            fs.existsSync(config.rootSrc + '/' + e + '/index.js') &&
            fs.statSync(config.rootSrc + '/' + e + '/index.js').isFile()) dir.push(e);
    });
    return dir;
}

function init(req, res) {
    let a = url.parse(req.url);
    config.pathname = a.pathname.slice(1).split('/');
    config.db = db;
    let dirArr = _readDir();
    let dirIndex = dirArr.filter((e) => e == config.pathname[0]);
    if (dirIndex.length > 0) {
        require(config.rootSrc + '/' + dirIndex)(req, res, config);
    } else {
        res.status(500).end('err')
    };
}