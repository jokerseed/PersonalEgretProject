namespace game {
    export class SocketManager {
        private _socket: egret.WebSocket;
        private _isConnected: boolean;

        constructor() {
            let self = this;
            self._isConnected = false;
            let socket = self._socket = new egret.WebSocket();
            socket.addEventListener(egret.Event.CONNECT, self.onConnectOpen, self);
            socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, self.onReceiveData, self);
        }

        /**
         * 连接成功
         */
        private onConnectOpen(event: egret.Event) {
            console.log("连接成功");
            let self = this;
            self._isConnected = true;

            //打开一个类主界面
            layerManager.add(ELayer.one, new GameFullView());
        }

        /**
         * 收到服务端数据
         */
        private onReceiveData(event: egret.ProgressEvent) {
            let self = this;
            let msg = self._socket.readUTF();
            console.log("收到数据：" + msg);
        }

        /**
         * 连接服务器
         */
        public connectServer() {
            let self = this;
            self._socket.connect("echo.websocket.org", 80);
        }

        /**
         * 发送数据
         */
        public sendMessage() {
            let self = this;
            if (!self._isConnected) {
                return;
            }
            var cmd = '{"cmd":"uzwan_login","gameId":"0","from":"guzwan","userId":"3565526"}';
            self._socket.writeUTF(cmd);
        }
    }

    export let socketManager = new SocketManager();
}