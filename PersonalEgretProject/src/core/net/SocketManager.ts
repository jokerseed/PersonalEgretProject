namespace game {
    export class SocketManager {
        private _socket: egret.WebSocket;
        private _isConnected: boolean;

        constructor() {
            let self = this;
            self._isConnected = false;
            let socket = self._socket = new egret.WebSocket();
            /**二进制传输 */
            self._socket.type = egret.WebSocket.TYPE_BINARY;
            socket.addEventListener(egret.Event.CONNECT, self.onConnectOpen, self);
            socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, self.onReceiveData, self);
            socket.addEventListener(egret.IOErrorEvent.IO_ERROR, self.error, self);
        }

        /**
         * 传输错误
         */
        private error(e: egret.Event) {

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
            // let msg = self._socket.readUTF();
            // console.log("收到数据：" + msg);
            //创建 ByteArray 对象
            var byte: egret.ByteArray = new egret.ByteArray();
            //读取数据
            this._socket.readBytes(byte);
            //读取字符串信息
            var msg: string = byte.readUTF();
            //读取布尔值信息
            var boo: boolean = byte.readBoolean();
            //读取int值信息
            var num: number = byte.readInt();
            this.trace("收到数据:");
            this.trace("readUTF : " + msg);
            this.trace("readBoolean : " + boo.toString());
            this.trace("readInt : " + num.toString());
        }

        private trace(msg: any): void {
            console.log(msg);
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
            if (!self._isConnected || !self._socket.connected) {
                return;
            }
            // let test = { "name": "我是大帅哥", age: 1 }
            // self._socket.writeUTF(JSON.stringify(test));
            self.sendData();
        }

        /**
         * 关闭套接字
         */
        public closeConnect() {
            let self = this;
            self._socket.close();
        }

        private sendData() {
            var byte = new egret.ByteArray();
            byte.writeUTF("我是大帅哥");
            byte.writeBoolean(false);
            byte.writeInt(123);
            byte.position = 0;
            this._socket.writeBytes(byte);
        }
    }

    export const socketManager = new SocketManager();
}