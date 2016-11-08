/**
 *
 * Created by jiajiangyi on 2016/11/3.
 */

"use strict";

var express = require("express"),
    app = express(),
    url = require("url"),
    path = require("path"),
    fs = require("fs");

var port = process.env.port || 3000;
var root = "h:\\Share";//对外分享的路径

var address = getIPAdress();//本机Ip地址
var host = "http://" + address + ":" + port + "/";

app.get('/*', (req, res)=> {

    var filePath = (req.url).slice(1);//去掉地址里多余的"/"
    filePath = filePath ? filePath : root;
    filePath = filePath.replace(/\//g, "\\");
    filePath = decodeURI(filePath);

    if (filePath == "favicon.ico") {//去除浏览器请求favicon.ico文件带来的干扰
        return;
    }
    fs.exists(filePath, (exists)=> {
        if (exists && filePath.substring(0, root.length) == root) {
            fs.stat(filePath, (err, status)=> {
                if (status.isDirectory()) {
                    showFile(req, res, filePath);
                } else {
                    res.download(filePath);
                }
            });
        } else {
            console.log("文件不存在");
            res.send("Not Found!");
            res.end();
        }
    });

});

/**
 * 读取路径中的内容
 * @param req
 * @param res
 * @param fileUrl
 */
function showFile(req, res, fileUrl) {

    fs.readdir(fileUrl, (err, results)=> {
        var li = "";
        results.forEach((file)=> {
            var url = path.join(fileUrl, file);
            li += '<li><a href="' + host + url + '">' + file + '</a></li>';
        });
        res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
        res.end(li);

    });
}
/**
 *获取本机的IP地址
 * @returns {*}
 */
function getIPAdress() {
    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}

app.listen(port, ()=> {
    console.log("fileServer is running ", host);
});