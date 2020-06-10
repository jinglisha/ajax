var http = require('http');
var url = require('url');
var fs = require('fs');
var req = require('request');
http.createServer(function (request, response) {
    console.log('服务已起动');
    var pathName = url.parse(request.url).pathname;
    var params = url.parse(request.url, true).query;
    console.log(pathName, params)
    if (pathName == '/chat') {
        var data = {
            "reqType": 0,
            "perception": {
                "inputText": {
                    "text": params.text
                }
            },
            "userInfo": {
                "apiKey": "0e6e6058578344789a8820de7b541cc1",
                "userId": "123456"
            }
        }
        var contents = JSON.stringify(data);
        req({
            url: "http://openapi.tuling123.com/openapi/api/v2",
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: contents
        }, function (error, resp, body) {
            console.log('proxy::', resp, body)
            if (!error && resp.statusCode == 200) {
                var head = {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET",
                    "Access-Control-Allow-Headers": "x-requested-with , content-type",
                    "Content-Type": 'application/json'
                }
                response.writeHead(200, head);
                var obj = JSON.parse(body);
                if (obj && obj.results && obj.results.length > 0 && obj.results[0].values) {
                    response.write(JSON.stringify(obj.results[0].values));
                    response.end();
                } else {
                    response.write("{\"text\":\"布吉岛你说的是什么~\"}");
                    response.end();
                }
            } else {
                response.writeHead(400);
                response.write("数据异常");
                response.end();
            }
        });
    }
}).listen(3000);