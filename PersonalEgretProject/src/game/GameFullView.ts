namespace game {
    export class GameFullView extends eui.Component {
        public constructor() {
            super();
        }

        public childrenCreated() {
            super.childrenCreated();
            let self = this;
            self.test();
        }

        public test() {
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
    }
}