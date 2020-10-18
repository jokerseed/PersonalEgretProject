var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Util = (function () {
    function Util() {
    }
    Util.getInstance = function () {
        if (!this._instance) {
            this._instance = new Util();
        }
        return this._instance;
    };
    Util.prototype.setStageSize = function (width, height) {
        Util.stageWidth = width;
        Util.stageHeight = height;
        console.log("屏幕宽高:" + Util.stageWidth + "," + Util.stageHeight);
    };
    Util.stageWidth = 0;
    Util.stageHeight = 0;
    return Util;
}());
__reflect(Util.prototype, "Util");
//# sourceMappingURL=Util.js.map