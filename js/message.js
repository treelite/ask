/**
 * @file 显示问题
 * @author cxl(c.xinle@gmail.com)
 */

(function (global) {

    var view = {};
    var messageHandler = {};

    messageHandler.up = function (data) {
        var ele = view.container;
        var items = ele.getElementsByTagName('p');
        var target;

        for (var i = 0, item; item = items[i]; i++) {
            if (item.getAttribute('data-id') == data.no) {
                target = item;
            }
        }

        if (target) {
            target.className += ' message-em';
            ele.removeChild(target);
            if (ele.firstChild) {
                ele.insertBefore(target, ele.firstChild);
            }
            else {
                ele.appendChild(target);
            }
        }
    };

    messageHandler.message = function (data) {
        var item = baidu.dom.create('p');
        var ele = view.container;
        item.setAttribute('data-id', data.no);
        item.innerHTML = '<a href="#" data-id="'+ data.no +'" class="message-opt" >UP</a>'
            + baidu.string.encodeHTML(data.no + '. ' + data.msg);
        if (ele.firstChild) {
            ele.insertBefore(item, ele.firstChild);
        }
        else {
            ele.appendChild(item);
        }
    };

    messageHandler.reset = function () {
        view.container.innerHTML = '';
    };
   
    function createMessageHandler() {
        return function (data) {
            data = baidu.json.parse(data.data);

            var handle = messageHandler[data.type];

            if (handle) {
                handle.call(null, data);
            }
        };
    }

    function bindEvents() {
        view.container.onclick = function (e) {
            e = e || window.event; 

            var target = e.target || e.srcElement;

            if (target.tagName.toLowerCase() == 'a' && target.className.indexOf('message-opt') >= 0) {
                var id = target.getAttribute('data-id');
                baidu.ajax.post('/up', 'id=' + id);
                return false;
            }
        };
    }

    global.engineStart = function (url, port, area) {
        if (baidu.ie && baidu.ie < 10) {
            alert('亲~现代浏览器遍地都是，不要再用IE啦，你知道这样累屎了多少可爱的FE莫~ \n啥？已经用的是IE9了？No No No 再怎么着也要用个IE10嘛');
            window.close();
            return;
        }

        url = 'ws://' + url + (port ? ':' + port : '');
        var ws = new WebSocket(url);

        view.container = area;
        bindEvents();
        ws.onmessage = createMessageHandler();
    };

})(this);
