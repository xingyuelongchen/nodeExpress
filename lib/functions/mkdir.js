const QS = require("querystring");
const FS = require('fs');
const PATH = require('path');
module.exports=function(req,res){
    let path = req.url.replace('/mkdir','');
    path =QS.unescape(path);
    res.end(JSON.stringify(mkdir(path)));
}
/// 用于查询当前路径目录是否都存在,不存在则创建
let a = '';
savePath.split('\\').forEach(e => {
    a += e;
    if (!FS.existsSync(a)) {
        FS.mkdirSync(savePath)
    }
    a += '\\';
})
/****************************888888888888888888888 */

function mkdir(path){
    path = PATH.resolve(__dirname,'../'+path)
    // console.log(path);
    var isDir = FS.existsSync(path);
    if(isDir){
        return {status:404,message:'已有同名目录'}
    }else{
        var a= FS.mkdirSync(path)
        if(!a){
            return {status:200,message:'创建成功'}
        }else{
            return {status:404,message:'创建失败'}
        }
    }
}