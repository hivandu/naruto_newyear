var express = require('express'),
    https = require('https'),
    urllib = require('url'),
    app = express();

app.get('/userinfo', function (req, res) {
    var appid = 'wxb66fe8e6ed2e6e02';
    var secret = 'c6702f33202d0b98badf453a5f7a7bfa';
    var code = req.param('code');
    console.log('someone requested');

    var get_access_token = https.get('https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + appid + '&secret=' + secret + '&code=' + code + '&grant_type=authorization_code', function (result) {
        result.on('data', function (data) {
            var token = JSON.parse(data.toString('utf8'));
            console.log(token);

            var getUserInfo = https.get('https://api.weixin.qq.com/sns/userinfo?access_token=' + token.access_token + '&openid=' + token.openid, function (result) {
                result.on('data', function (info) {
                    var info = info.toString('utf8');
                    console.log('pull user info...', info);
                    var params = urllib.parse(req.url, true);
                    if (params.query && params.query.callback) {
                        var str =  params.query.callback + '(' + info + ')';//jsonp
                        res.end(str);
                    } else {
                        res.end(info);//普通的json
                    }
                });
            });
        });
    });
});

app.listen(1248);