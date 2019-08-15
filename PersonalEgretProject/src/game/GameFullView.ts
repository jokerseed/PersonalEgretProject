namespace game {
    export class GameFullView extends eui.Component {
        public grp: eui.Group;

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
    }
}