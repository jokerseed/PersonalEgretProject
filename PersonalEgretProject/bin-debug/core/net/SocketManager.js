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
            socket.addEventListener(egret.Event.CONNECT, self.onConnectOpen, self);
            socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, self.onReceiveData, self);
        }
        /**
         * 连接成功
         */
        SocketManager.prototype.onConnectOpen = function (event) {
            console.log("连接成功");
            var self = this;
            self._isConnected = true;
            game.layerManager.add(0 /* one */, new game.GameFullView());
        };
        /**
         * 收到服务端数据
         */
        SocketManager.prototype.onReceiveData = function (event) {
            var self = this;
            var msg = self._socket.readUTF();
            console.log("收到数据：" + msg);
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
            if (!self._isConnected) {
                return;
            }
            var cmd = '{"cmd":"uzwan_login","gameId":"0","from":"guzwan","userId":"3565526"}';
            self._socket.writeUTF(cmd);
        };
        return SocketManager;
    }());
    game.SocketManager = SocketManager;
    __reflect(SocketManager.prototype, "game.SocketManager");
    game.socketManager = new SocketManager();
})(game || (game = {}));
//# sourceMappingURL=SocketManager.js.map