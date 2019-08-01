namespace game {
    export class Socket extends egret.EventDispatcher {
        /**
         * 连接成功事件
         */
        public static OPEN: string = "open";

        /**
         * 消息到达事件
         */
        public static MESSAGE: string = "message";

        /**
         * 连接关闭事件
         */
        public static CLOSE: string = "close";

        /**
         * 连接错误事件
         */
        public static ERROR: string = "error";

        private _webSocket: WebSocket;
        private _endian: string = egret.Endian.BIG_ENDIAN;
        private _input: egret.ByteArray;
        private _output: egret.ByteArray;
        private _connected: boolean = false;
        private _cacheInput: boolean = true;
        private _addInputPosition: number = 0;

        public constructor(host?: string, port?: number) {
            super();
            if (host && port > 0 && port < 65535) {//端口号用16bit表示的整数
                this.connect(host, port);
            }
        }

        /**
         * 套接字字节码顺序.
         */
        public set endian(value: string) {
            this._endian = value;
        }

        public get endian(): string {
            return this._endian;
        }

        /**
         * 获取输入流.
         */
        public get input(): egret.ByteArray {
            return this._input;
        }

        /**
         * 获取输出流.
         */
        public get output(): egret.ByteArray {
            return this._output;
        }

        /**
         * 连接服务器
         */
        public connect(host: string, port: number) {
            let url;
            if (window.location.protocol == "https:") {
                url = "wss://" + host + ":" + port;
            } else {
                url = "ws://" + host + ":" + port;
            }
            this.connectByUrl(url);
        }

        /**
         * 连接服务器
         */
        public connectByUrl(url: string) {
            let self = this;
            if (self._webSocket) {
                self.close();
            }

            self._webSocket = new WebSocket(url);
            self._webSocket.binaryType = "arraybuffer";
            self._input = new egret.ByteArray();
            self._input.endian = self._endian;
            self._output = new egret.ByteArray();
            self._output.endian = self._endian;
            self._addInputPosition = 0;

            self._webSocket.onopen = (event: Event) => {

            };
            self._webSocket.onmessage = (messageEvent: MessageEvent) => {

            };
            self._webSocket.onclose = (closeEvent: CloseEvent) => {

            };
            self._webSocket.onerror = (errorEvent: ErrorEvent) => {

            }
        }

        private onOpen(event: Event) {
            let self = this;
            self._connected = true;
            self.dispatchEventWith(Socket.OPEN, false, event);
        }

        private onMessage(messageEvent: MessageEvent) {
            let self = this;
            if (!messageEvent || !messageEvent.data) {
                return;
            }
            let data = messageEvent.data;
            //不缓存接收的数据则直接抛出数据
            if (!self._cacheInput && data) {
                self.dispatchEventWith(Socket.MESSAGE, false, data)
                return;
            }
            //如果输入流全部被读取完毕则清空
            if (self._input.length > 0 && self._input.bytesAvailable < 1) {
                self._input.clear();
                self._addInputPosition = 0;
            }
            //获取当前的指针位置
            let pre = self._input.position;
            if (!self._addInputPosition) {
                self._addInputPosition = 0;
            }
            //指向添加数据的指针位置
            self._input.position = self._addInputPosition;
            if (data) {
                //添加数据
                if ((typeof data == "string")) {
                    self._input.writeUTFBytes(data);
                } else {
                    self._input._writeUint8Array(new Uint8Array(data));
                }
                //记录下一次添加数据的指针位置
                self._addInputPosition = self._input.position;
                //还原到当前的指针位置
                self._input.position = pre;
            }
            self.dispatchEventWith(Socket.MESSAGE, false, data);
        }

        private onClose(closeEvent: CloseEvent) {
            let self = this;
            self._connected = false;
            self.dispatchEventWith(Socket.CLOSE, false, event);
        }

        private onError(errorEvent: ErrorEvent) {
            this.dispatchEventWith(Socket.ERROR, false, event);
        }

        /**
         * 关闭连接
         */
        public close() {
            let self = this;
            if (self._webSocket) {
                self.clearSocket();
            }
        }

        private clearSocket() {
            let self = this;
            self._webSocket.close();
            self._connected = false;
            self._webSocket.onopen = null;
            self._webSocket.onmessage = null;
            self._webSocket.onclose = null;
            self._webSocket.onerror = null;
            self._webSocket = null;
        }
    }
}