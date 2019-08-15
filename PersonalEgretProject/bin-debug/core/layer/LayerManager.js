var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var game;
(function (game) {
    var LayerManager = (function () {
        function LayerManager() {
        }
        LayerManager.prototype.setParent = function (parent) {
            var self = this;
            self.init();
            self._parent = parent;
            parent.addChild(self._one);
            parent.addChild(self._two);
        };
        LayerManager.prototype.init = function () {
            var self = this;
            var one = self._one = new eui.Group();
            one.percentWidth = one.percentHeight = 100;
            one.touchThrough = true;
            var two = self._two = new eui.Group();
            two.percentWidth = two.percentHeight = 100;
            two.touchThrough = true;
        };
        LayerManager.prototype.add = function (index, view) {
            var self = this;
            var grp = self._parent.getChildAt(index);
            grp.addChild(view);
        };
        return LayerManager;
    }());
    game.LayerManager = LayerManager;
    __reflect(LayerManager.prototype, "game.LayerManager");
    game.layerManager = new LayerManager();
})(game || (game = {}));
//# sourceMappingURL=LayerManager.js.map