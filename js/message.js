/**
 * @file 显示问题
 * @author cxl(c.xinle@gmail.com)
 */

(function (global) {
   
    function createMessageHandler(ele) {
        return function (data) {
            var item = baidu.dom.create('p');
            data = baidu.json.parse(data.data);
            item.innerHTML = baidu.string.encodeHTML(data.no + '. ' + data.msg);
            if (ele.firstChild) {
                ele.insertBefore(item, ele.firstChild);
            }
            else {
                ele.appendChild(item);
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

        ws.onmessage = createMessageHandler(area);
    };

})(this);
