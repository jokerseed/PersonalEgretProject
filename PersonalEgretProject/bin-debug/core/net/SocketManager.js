var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var game;
(function (game) {
    var SocketManager = (function () {
        function SocketManager() {
            var self = this;
            self._isConnected = false;
            var socket = self._socket = new egret.WebSocket();
            /**二进制传输 */
            self._socket.type = egret.WebSocket.TYPE_BINARY;
            socket.addEventListener(egret.Event.CONNECT, self.onConnectOpen, self);
            socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, self.onReceiveData, self);
            socket.addEventListener(egret.IOErrorEvent.IO_ERROR, self.error, self);
        }
        /**
         * 传输错误
         */
        SocketManager.prototype.error = function (e) {
        };
        /**
         * 连接成功
         */
        SocketManager.prototype.onConnectOpen = function (event) {
            console.log("连接成功");
            var self = this;
            self._isConnected = true;
            //打开一个类主界面
            game.layerManager.add(0 /* one */, new game.GameFullView());
        };
        /**
         * 收到服务端数据
         */
        SocketManager.prototype.onReceiveData = function (event) {
            var self = this;
            // let msg = self._socket.readUTF();
            // console.log("收到数据：" + msg);
            //创建 ByteArray 对象
            var byte = new egret.ByteArray();
            //读取数据
            this._socket.readBytes(byte);
            //读取字符串信息
            var msg = byte.readUTF();
            //读取布尔值信息
            var boo = byte.readBoolean();
            //读取int值信息
            var num = byte.readInt();
            this.trace("收到数据:");
            this.trace("readUTF : " + msg);
            this.trace("readBoolean : " + boo.toString());
            this.trace("readInt : " + num.toString());
        };
        SocketManager.prototype.trace = function (msg) {
            console.log(msg);
        };
        /**
         * 连接服务器
         */
        SocketManager.prototype.connectServer = function () {
            var self = this;
            self._socket.connect("echo.websocket.org", 80);
        };
        /**
         * 发送数据
         */
        SocketManager.prototype.sendMessage = function () {
            var self = this;
            if (!self._isConnected || !self._socket.connected) {
                return;
            }
            // let test = { "name": "我是大帅哥", age: 1 }
            // self._socket.writeUTF(JSON.stringify(test));
            self.sendData();
        };
        /**
         * 关闭套接字
         */
        SocketManager.prototype.closeConnect = function () {
            var self = this;
            self._socket.close();
        };
        SocketManager.prototype.sendData = function () {
            var byte = new egret.ByteArray();
            byte.writeUTF("我是大帅哥");
            byte.writeBoolean(false);
            byte.writeInt(123);
            byte.position = 0;
            this._socket.writeBytes(byte);
        };
        return SocketManager;
    }());
    game.SocketManager = SocketManager;
    __reflect(SocketManager.prototype, "game.SocketManager");
    game.socketManager = new SocketManager();
})(game || (game = {}));
//# sourceMappingURL=SocketManager.js.map