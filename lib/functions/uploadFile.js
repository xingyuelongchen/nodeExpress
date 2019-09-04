const md5 = require('md5');
const FS = require('fs');
const multiparty = require('multiparty');
const PATH = require('path');
const delDir = require('./delDir')
module.exports = a;

/**
 * 
 * @param {Object} option 需要包含req,path两个参数,表示request 和 存储路径信息
 * @param {Function} fn 回调函数 包含三个参数 error filepath fields 
 */
function a(option, fn) {
    let { path, req } = option;
    // 存储目录路径
    let savePath = PATH.resolve(__dirname, '../../src/assets' + path);
    let cachePath = PATH.resolve(__dirname, '../cacheUploads');
    let saveFilePath = [];
    if (req.method.toLowerCase() == 'post') {
        //目录不存在则创建
        if (!FS.existsSync(cachePath)) {
            FS.mkdirSync(cachePath)
        }

        let a = '';
        savePath.split('\\').forEach(e => {
            a += e;
            if (!FS.existsSync(a)) {
                FS.mkdirSync(savePath)
            }
            a += '\\';
        })
        // 初始化文件接收对象
        var form = new multiparty.Form({
            // 指定缓存目录
            uploadDir: cachePath
        });
        // 格式化接收到的文件信息
        form.parse(req, function (err, fields, files) {
            // console.log(files);
            if (err) { fn(err); return; };
            // 逐个处理上传的文件信息
            Object.values(files).forEach(file => {

                // 获取当前文件缓存路径
                var cacheFilePath = PATH.normalize(file[0].path);

                // 文件重命名
                let filename = md5(file + Date.now()) + PATH.extname(file[0].originalFilename);
                let filePath = savePath + '\\' + filename;

                //  把文件从缓存目录移动到指定目录
                if (!!FS.renameSync(cacheFilePath, filePath)) {
                    return true;
                }
                // 移动成功 将文件路径添加到数组
                saveFilePath.push('assets' + path + '/' + filename);
                
                

            });
            fn(null, saveFilePath, fields)
            delDir(cachePath);
        });

    }
}