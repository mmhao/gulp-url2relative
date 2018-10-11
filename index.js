var through = require('through2');
var path = require("path");
var options_def = {
    isLink: false,
    data: {},
    prefix: "@@",
    suffix: "css|js|jpg|jpeg|png|gif|svg|ico|eot|otf|ttf|ttc|woff|woff2"
};
module.exports = function gulp_prefix(options){
    var opts = extend({}, options_def, options);
    var stream = through.obj(function(file, encoding, callback){
        // 如果file类型不是buffer 退出不做处理
        if(!file.isBuffer()){
            return callback();
        }
        var filePath = file.path;
        var content = replaceUrl(file.contents.toString(), path.dirname(filePath), opts);
        file.contents = new Buffer(content, 'utf-8');
        // 确保文件会传给下一个插件
        this.push(file);

        // 告诉stream引擎，已经处理完成
        callback();
    });
    
    return stream;
};
//更改路径
function replaceUrl(data, filePath, opts){
    var attrData = opts.data || {};
    var prefix = opts.prefix;
    var suffix = opts.suffix;

    for (var attr in attrData) {
        var reg = new RegExp(prefix + attr+"[^\\s'\"]+.("+suffix+")", "g");
        
        data = data.replace(reg, function(s) {

            var url = s.substring((prefix + attr).length);
            var rootPath = attrData[attr];

            if (opts.isLink) {
                return rootPath+url;
            }
            else {
                var retUrl = path.relative(filePath, rootPath);
                return (retUrl + url).replace(/\\/g, "/");
            }
        });
    }
    
    return data;
}

//深复制对象
function copy(data, obj) {
    var obj = obj || {};
    for (var name in data) {
        if (typeof data[name] === "object") { //先判断一下obj[name]是不是一个对象
            obj[name] = (data[name].constructor === Array) ? [] : {}; //我们让要复制的对象的name项=数组或者是json
            copy(data[name], obj[name]); //然后来无限调用函数自己 递归思想
        } else {
            obj[name] = data[name]; //如果不是对象，直接等于即可，不会发生引用。
        }
    }
    return obj; //然后在把复制好的对象给return出去
}
//覆盖对象，使用跟jq一样
function extend() {
    var obj = {};
    var arg = [].slice.call(arguments, 0);
    for (var i = 0, lenI = arg.length; i < lenI; i++) {
        if (typeof arg[i] === "object") {
            obj = copy(arg[i], obj);
        }
    }
    return obj;
}
