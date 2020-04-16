var game;
(function (game) {
    var Net;
    (function (Net) {
        var _conned = false; //已连接成功过
        var _inConning = false;
        var _sockClose = false; //信息失效，需要重新取过token
        var _sock;
        var _tryCnt = 0;
        //let _doReconn:boolean = false;
        var _handles = {};
        function connect() {
            _tryCnt = 0;
            doConnect();
        }
        Net.connect = connect;
        function loginFin(succ) {
            if (_inConning) {
                if (Net.busyUI)
                    Net.busyUI.hideBusy();
                _inConning = false;
            }
            _sockClose = !succ;
            if (succ) {
                _tryCnt = 0;
            }
        }
        Net.loginFin = loginFin;
        function createSock() {
            if (_sock) {
                clearSock();
            }
            _sock = new egret.WebSocket();
            _sock.type = egret.WebSocket.TYPE_BINARY;
            _sock.once(egret.Event.CONNECT, onConnect, Net);
            //_sock.addEventListener(egret.IOErrorEvent.IO_ERROR, onErr, Net);
            _sock.once(egret.Event.CLOSE, onClose, Net);
            _sock.connectByUrl(Net.ip);
        }
        function clearSock() {
            _sock.removeEventListener(egret.Event.CONNECT, onConnect, Net);
            //_sock.removeEventListener(egret.IOErrorEvent.IO_ERROR, onErr, Net);
            _sock.removeEventListener(egret.Event.CLOSE, onClose, Net);
            _sock.removeEventListener(egret.ProgressEvent.SOCKET_DATA, onData, Net);
            _sock.close();
            _sock = null;
        }
        function onConnect() {
            if (true)
                console.log("net connected");
            _conned = true;
            //_inConning = false;
            notifiCenter.postEvent("succ" /* CONN_SUCC */);
            _sock.addEventListener(egret.ProgressEvent.SOCKET_DATA, onData, Net);
        }
        // function onErr(){
        //     if(DEBUG) console.log( "net io error tryCnt=" + _tryCnt );
        //     if( _inConning ){
        //         return;
        //     }
        //     TRain.core.addDelayDo( doConnect, Net, 1000+_tryCnt*500 );
        // }
        function onClose() {
            if (_sockClose)
                return;
            notifiCenter.postEvent("close" /* CONN_CLOSE */);
            if (_conned) {
                Net.isReCon = true;
                TRain.core.addDelayDo(doConnect, Net, 1000);
            }
            else {
                notifiCenter.postEvent("fail" /* CONN_FAIL */);
            }
        }
        function doConnect() {
            _tryCnt++;
            if (_tryCnt >= 3) {
                if (Net.busyUI && _inConning)
                    Net.busyUI.hideBusy();
                // if( _doReconn ){
                //     notifiCenter.postEvent( CONN_EVT.CONN_FAIL );
                // }
                // else{
                //     _doReconn = true;
                notifiCenter.postEvent("re" /* RECONN */);
                //}
                return;
            }
            if (!_inConning) {
                if (Net.busyUI)
                    Net.busyUI.showBusy();
                _inConning = true;
            }
            _sockClose = false;
            if (true)
                console.log("net connect " + Net.ip);
            createSock();
        }
        //---------------------------------------------------
        function regHandle(msgId, handler, tar) {
            _handles[msgId] = { fun: handler, tar: tar };
        }
        Net.regHandle = regHandle;
        function unregHandle(msgId) {
            delete _handles[msgId];
        }
        Net.unregHandle = unregHandle;
        function onData() {
            var buf = new egret.ByteArray();
            buf.endian = egret.Endian.LITTLE_ENDIAN;
            _sock.readBytes(buf);
            var msg = game.Package.decode(buf);
            decodeMsg(msg.id, msg.len, buf);
        }
        function decodeMsg(msgId, len, buf) {
            if (true)
                console.log("receive id=" + msgId);
            var handle = _handles[msgId];
            if (handle) {
                var data = game.Protobuf.decode(msgId, buf.position + len, buf);
                handle.fun.call(handle.tar, data);
            }
            else if (true) {
                egret.log("msg not handle id=" + msgId);
            }
            if (Net.busyUI) {
                if (_waitMsg[msgId]) {
                    _waitMsg[msgId] = 0;
                    Net.busyUI.hideBusy();
                }
            }
        }
        Net.decodeMsg = decodeMsg;
        //----------------------------------------------------
        function _sendMsg(msgId, args) {
            //console.log( "SendMsg msgId=" + msgId + "  args=" + JSON.stringify(args) );
            var buf = new egret.ByteArray();
            buf.endian = egret.Endian.LITTLE_ENDIAN;
            var start = 6;
            buf.position = start;
            game.Protobuf.encode(msgId, args, buf);
            var len = buf.position - start;
            buf.position = 0;
            game.Package.encode(msgId, len, buf);
            _sock.writeBytes(buf);
            _sock.flush();
        }
        function sendMsg(msgId, args) {
            if (!_sock.connected)
                return;
            _sendMsg(msgId, args);
        }
        Net.sendMsg = sendMsg;
        /**
         * 过滤掉 所有在间隔时间内发送的相同消息（即id一样）
         * intervalMaxTm 最长间隔时间
         * */
        var _sameMsgs = {};
        function sendMsgFilter(msgId, args, intervalMaxTm) {
            if (!_sock.connected)
                return;
            var curTm = egret.getTimer();
            var oldTm = _sameMsgs[msgId];
            if (oldTm) {
                if (curTm < oldTm) {
                    return;
                }
            }
            _sameMsgs[msgId] = curTm + intervalMaxTm;
            _sendMsg(msgId, args);
        }
        Net.sendMsgFilter = sendMsgFilter;
        /**
         * 发送消息后进入等待，直到结果消息返回
         * resultMsgId 结果消息
         * */
        var _waitMsg = {};
        function sendMsgWait(msgId, args, resultMsgId) {
            if (!_sock.connected)
                return;
            if (Net.busyUI) {
                _waitMsg[resultMsgId] = 1;
                Net.busyUI.showBusy();
            }
            _sendMsg(msgId, args);
        }
        Net.sendMsgWait = sendMsgWait;
    })(Net = game.Net || (game.Net = {}));
})(game || (game = {}));
//# sourceMappingURL=Net.js.map