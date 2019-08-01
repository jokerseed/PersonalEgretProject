var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var game;
(function (game) {
    var ViewManager = (function () {
        function ViewManager() {
        }
        Object.defineProperty(ViewManager, "instance", {
            get: function () {
                return ViewManager._instance || (ViewManager._instance = new ViewManager());
            },
            enumerable: true,
            configurable: true
        });
        ViewManager.prototype.a = function () {
            game.test();
        };
        return ViewManager;
    }());
    game.ViewManager = ViewManager;
    __reflect(ViewManager.prototype, "game.ViewManager");
})(game || (game = {}));
//# sourceMappingURL=ViewManager.js.map