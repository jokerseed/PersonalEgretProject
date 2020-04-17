module game {
    export const enum CONN_EVT {
        RECONN = "re",
        CONN_SUCC = "succ",
        CONN_FAIL = "fail",
        CONN_CLOSE = "close"
    }

    export type DecodeData = {
        off: number;
        data: egret.ByteArray;
    }

    export module Net {
        export let busyUI: ILoadShow;

        export let ip: string;

        export let isReCon: boolean;//断线重联

        let _conned = false; //已连接成功过
        let _inConning = false;
        let _sockClose = false;//信息失效，需要重新取过token
        let _sock: egret.WebSocket;
        let _tryCnt: number = 0;
        //let _doReconn:boolean = false;

        let _handles: { [key: number]: { fun: (data: any) => void, tar: any } } = {};

        export function connect() {
            _tryCnt = 0;
            doConnect();
        }

        export function loginFin(succ: boolean) {
            if (_inConning) {
                if (busyUI) busyUI.hideBusy();
                _inConning = false;
            }

            _sockClose = !succ;
            if (succ) {
                _tryCnt = 0;
            }
        }

        function createSock() {
            if (_sock) {
                clearSock();
            }

            _sock = new egret.WebSocket();
            _sock.type = egret.WebSocket.TYPE_BINARY;
            _sock.once(egret.Event.CONNECT, onConnect, Net);
            //_sock.addEventListener(egret.IOErrorEvent.IO_ERROR, onErr, Net);
            _sock.once(egret.Event.CLOSE, onClose, Net);
            _sock.connectByUrl(ip);
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
            if (DEBUG) console.log("net connected");

            _conned = true;
            //_inConning = false;
            notifiCenter.postEvent(CONN_EVT.CONN_SUCC);
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
            if (_sockClose) return;

            notifiCenter.postEvent(CONN_EVT.CONN_CLOSE);
            if (_conned) {
                isReCon = true;
                TRain.core.addDelayDo(doConnect, Net, 1000);
            }
            else {
                notifiCenter.postEvent(CONN_EVT.CONN_FAIL);
            }
        }

        function doConnect() {
            _tryCnt++;
            if (_tryCnt >= 3) {
                if (busyUI && _inConning) busyUI.hideBusy();
                // if( _doReconn ){
                //     notifiCenter.postEvent( CONN_EVT.CONN_FAIL );
                // }
                // else{
                //     _doReconn = true;
                notifiCenter.postEvent(CONN_EVT.RECONN);
                //}
                return;
            }

            if (!_inConning) {
                if (busyUI) busyUI.showBusy();
                _inConning = true;
            }

            _sockClose = false;
            if (DEBUG) console.log("net connect " + ip);
            createSock();
        }

        //---------------------------------------------------
        export function regHandle(msgId: number, handler: (data: any) => void, tar: any) {
            _handles[msgId] = { fun: handler, tar: tar };
        }

        export function unregHandle(msgId: number) {
            delete _handles[msgId];
        }

        function onData() {
            let buf: egret.ByteArray = new egret.ByteArray();
            buf.endian = egret.Endian.LITTLE_ENDIAN;
            _sock.readBytes(buf);
            let msg = Package.decode(buf);
            decodeMsg(msg.id, msg.len, buf);
        }

        export function decodeMsg(msgId: number, len: number, buf: egret.ByteArray): void {
            if (DEBUG) console.log("receive id=" + msgId);

            let handle = _handles[msgId];
            if (handle) {
                let data = Protobuf.decode(msgId, buf.position + len, buf);
                handle.fun.call(handle.tar, data);
            }
            else if (DEBUG) {
                egret.log("msg not handle id=" + msgId);
            }

            if (busyUI) {
                if (_waitMsg[msgId]) {
                    _waitMsg[msgId] = 0;
                    busyUI.hideBusy();
                }
            }
        }

        //----------------------------------------------------
        function _sendMsg(msgId: number, args: any) {
            //console.log( "SendMsg msgId=" + msgId + "  args=" + JSON.stringify(args) );
            let buf: egret.ByteArray = new egret.ByteArray();
            buf.endian = egret.Endian.LITTLE_ENDIAN;
            let start = 6;
            buf.position = start;
            Protobuf.encode(msgId, args, buf);

            let len = buf.position - start;
            buf.position = 0;
            Package.encode(msgId, len, buf);

            _sock.writeBytes(buf);
            _sock.flush();
        }

        export function sendMsg(msgId: number, args: any) {
            if (!_sock.connected) return;

            _sendMsg(msgId, args);
        }

        /**
         * 过滤掉 所有在间隔时间内发送的相同消息（即id一样） 
         * intervalMaxTm 最长间隔时间
         * */
        let _sameMsgs: { [key: number]: number } = {};
        export function sendMsgFilter(msgId: number, args: any, intervalMaxTm: number) {
            if (!_sock.connected) return;

            let curTm = egret.getTimer();
            let oldTm = _sameMsgs[msgId];
            if (oldTm) {
                if (curTm < oldTm) {
                    return;
                }
            }

            _sameMsgs[msgId] = curTm + intervalMaxTm;
            _sendMsg(msgId, args);
        }

        /**
         * 发送消息后进入等待，直到结果消息返回 
         * resultMsgId 结果消息
         * */
        let _waitMsg: { [key: number]: number } = {};
        export function sendMsgWait(msgId: number, args: any, resultMsgId: number) {
            if (!_sock.connected) return;

            if (busyUI) {
                _waitMsg[resultMsgId] = 1;
                busyUI.showBusy();
            }

            _sendMsg(msgId, args);
        }
    }
}