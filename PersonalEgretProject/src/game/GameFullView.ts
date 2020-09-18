namespace game {
    export class GameFullView extends eui.Component {
        public grp: eui.Group;
        public img: eui.Image;

        private _kb: KeyBoard;

        public constructor() {
            super();
            let self = this;
            self._kb = new KeyBoard();

            self._kb.addEventListener(KeyBoard.onkeydown, self.keyboard, self);
        }

        public childrenCreated() {
            super.childrenCreated();
            let self = this;
            self.wx();
            self.startParticle();
            self.testWebsocket();
            //测试扩展原型链方法
            egret.testExtends("测试原型链扩展方法");
            console.log(self.myChildNum);
            self.testRes();
            self.testTimer();
            this.testByteArray();
        }

        //微信
        public wx() {
            var bodyConfig: BodyConfig = new BodyConfig();
            bodyConfig.appId = "wxb801ecbdf34b0010";
            bodyConfig.debug = true;
            /// ... 其他的配置属性赋值
            /// 通过config接口注入权限验证配置
            if (wx) {
                wx.config(bodyConfig);
                wx.ready(function () {
                    /// 在这里调用微信相关功能的 API
                });
            }
        }

        //键盘点击
        public keyboard(event) {
            if (DEBUG) console.log(event.data);
        }

        //粒子
        public startParticle() {
            let self = this;
            let texture = RES.getRes("star_png");
            let config = RES.getRes("star_json");
            let system = new particle.GravityParticleSystem(texture, config);
            if (DEBUG) console.log(system);
            system.start();
            self.grp.addChild(system);
        }

        //websocket
        public testWebsocket() {
            socketManager.sendMessage();
        }

        //测试资源加载
        public testRes() {
            let self = this;
            self.img.source = "egret_icon_png";
        }

        //测试timer
        public testTimer() {
            let self = this;
            // timeManager.createTimer(500, 5);
            // timeManager2.startEnterFrame();
            // timeManager3.start();
        }

        /**测试byteArray */
        public testByteArray() {
            let ba = new egret.ByteArray();
            ba.writeInt(1111);
            ba.writeUTF("全高清");

            ba.position = 4;

            // console.log(ba.readInt());
            console.log(ba.readUTF());
        }
    }
}