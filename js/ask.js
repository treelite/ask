/**
 * @file 提问
 * @author cxl(c.xinle@gmail.com)
 */

baidu.dom.g('qForm').onsubmit = function () {
    var errEle = baidu.dom.g('error');
    errEle.innerHTML = '';

    var form = this;
    var msgEle = form['message'];
    var msg;
    msg = msgEle.value = baidu.string.trim(msgEle.value);

    var pass = true;
    if (msg.length <= 0) {
        errEle.innerHTML = '亲~ 写点啥吧~';
        pass = false;
    }
    else if (msg.length > 150) {
        errEle.innerHTML = '亲~ 150字就够啦~';
        pass = false;
    }

    var btn = baidu.dom.g('btn');
    if (pass) {
        btn.value = '正在提问...';
        btn.disabled = true;
        baidu.ajax.post(
            '/message', 
            'message=' + encodeURIComponent(msg), 
            function () {
                msgEle.value = '';
                btn.disabled = false;
                btn.value = '提问';
            }
        );
    }

    return false;
}
