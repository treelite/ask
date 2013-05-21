/**
 * @file 服务器脚本
 * @author cxl(c.xinle@gmail.com)
 */

/*global require:false, process:false */

var server = require('webser');
var util = require('util');
var WebSocketServer = require('websocket').server;

var httpServer = server.start(process.argv[2] || 8080, './');
var ws = new WebSocketServer({
                httpServer: httpServer,
                autoAcceptConnections: true
            });
var connectPool = [];

function createCloseHandler(uid) {
    return function () {
        var index = -1;
        connectPool.forEach(function (item, i) {
            if (item.uid == uid) {
                index = i;
            }
        });
        if (index >= 0) {
            connectPool.splice(index, 1);
        }
        util.log('someone leave ... ' + connectPool.length);
    };
}

function createErrorHandler(uid) {
    return function () {
        util.error(uid + ': something wrong...');
    };
}

ws.on('connect', function (connect) {
    var item = {
            uid: new Date().getTime(),
            connect: connect
        };

    connectPool.push(item);

    util.log('new one connect...' + connectPool.length);

    connect.on('close', createCloseHandler(item.uid));
    connect.on('error', createErrorHandler(item.uid));
});

var no = 0;
server.add('/message', {
    POST: function (data) {
        var res = {
                type: 'message',
                no: ++no,
                msg: data.message
            };

        data = JSON.stringify(res);
        connectPool.forEach(function (item) {
            item.connect.sendUTF(data);
        });

        return '{status: 0}';
    }
});

server.add('/up', {
    POST: function (data) {
        var res = {
            type: 'up',
            no: data.id
        };

        data = JSON.stringify(res);

        connectPool.forEach(function (item) {
            item.connect.sendUTF(data);
        });

        return '{status: 0}';
    }
});
