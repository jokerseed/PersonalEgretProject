var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var game;
(function (game) {
    var GameFullView = (function (_super) {
        __extends(GameFullView, _super);
        function GameFullView() {
            var _this = _super.call(this) || this;
            var self = _this;
            self._kb = new KeyBoard();
            self._kb.addEventListener(KeyBoard.onkeydown, self.keyboard, self);
            return _this;
        }
        GameFullView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            var self = this;
            self.wx();
            self.startParticle();
            self.testWebsocket();
            //测试扩展原型链方法
            egret.testExtends("测试原型链扩展方法");
            console.log(self.myChildNum);
            self.testRes();
            self.testTimer();
            this.testByteArray();
        };
        //微信
        GameFullView.prototype.wx = function () {
            var bodyConfig = new BodyConfig();
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
        };
        //键盘点击
        GameFullView.prototype.keyboard = function (event) {
            if (true)
                console.log(event.data);
        };
        //粒子
        GameFullView.prototype.startParticle = function () {
            var self = this;
            var texture = RES.getRes("star_png");
            var config = RES.getRes("star_json");
            var system = new particle.GravityParticleSystem(texture, config);
            if (true)
                console.log(system);
            system.start();
            self.grp.addChild(system);
        };
        //websocket
        GameFullView.prototype.testWebsocket = function () {
            game.socketManager.sendMessage();
        };
        //测试资源加载
        GameFullView.prototype.testRes = function () {
            var self = this;
            self.img.source = "egret_icon_png";
        };
        //测试timer
        GameFullView.prototype.testTimer = function () {
            var self = this;
            // timeManager.createTimer(500, 5);
            // timeManager2.startEnterFrame();
            // timeManager3.start();
        };
        /**测试byteArray */
        GameFullView.prototype.testByteArray = function () {
            var ba = new egret.ByteArray();
            ba.writeInt(1111);
            ba.writeUTF("全高清");
            ba.position = 5;
            // console.log(ba.readInt());
            console.log(ba.readUTF());
        };
        return GameFullView;
    }(eui.Component));
    game.GameFullView = GameFullView;
    __reflect(GameFullView.prototype, "game.GameFullView");
})(game || (game = {}));
//# sourceMappingURL=GameFullView.js.map