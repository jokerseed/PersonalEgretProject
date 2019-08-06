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
            return _super.call(this) || this;
        }
        GameFullView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            var self = this;
            self.test();
        };
        GameFullView.prototype.test = function () {
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
        return GameFullView;
    }(eui.Component));
    game.GameFullView = GameFullView;
    __reflect(GameFullView.prototype, "game.GameFullView");
})(game || (game = {}));
