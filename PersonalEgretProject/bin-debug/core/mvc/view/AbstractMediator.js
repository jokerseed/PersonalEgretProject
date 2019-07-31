var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Jokerseed;
(function (Jokerseed) {
    /**
     * 中介基类
     */
    var AbstractMediator = (function () {
        function AbstractMediator() {
        }
        return AbstractMediator;
    }());
    Jokerseed.AbstractMediator = AbstractMediator;
    __reflect(AbstractMediator.prototype, "Jokerseed.AbstractMediator");
})(Jokerseed || (Jokerseed = {}));
//# sourceMappingURL=AbstractMediator.js.map