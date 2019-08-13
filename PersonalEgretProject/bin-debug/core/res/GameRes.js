var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var game;
(function (game) {
    var GameRes = (function () {
        function GameRes() {
        }
        Object.defineProperty(GameRes, "instance", {
            get: function () {
                var self = this;
                return self._instance || (self._instance = new GameRes());
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 加载资源配置文件
         */
        GameRes.prototype.loadConfig = function (url, resourceRoot) {
            var self = this;
            RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, self.onConfigComplete, self);
            RES.loadConfig(url, resourceRoot);
        };
        GameRes.prototype.onConfigComplete = function (event) {
            var self = this;
            RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, self.onConfigComplete, self);
        };
        /**
         * 加载资源组
         */
        GameRes.prototype.loadGroup = function (name, priority) {
            if (priority === void 0) { priority = 0; }
            var self = this;
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, self.onGroupComplete, self);
            RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, self.onGroupLoadError, self);
            RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, self.onGroupProgress, self);
            RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, self.onItemLoadError, self);
            RES.loadGroup(name, priority);
        };
        GameRes.prototype.onGroupComplete = function (event) {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onGroupComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onGroupLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onGroupProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        };
        GameRes.prototype.onGroupLoadError = function (event) {
            console.warn("Group:" + event.groupName + " has failed to load");
        };
        GameRes.prototype.onGroupProgress = function (event) {
        };
        GameRes.prototype.onItemLoadError = function (event) {
            console.warn("Url:" + event.resItem.url + " has failed to load");
        };
        return GameRes;
    }());
    game.GameRes = GameRes;
    __reflect(GameRes.prototype, "game.GameRes");
})(game || (game = {}));
//# sourceMappingURL=GameRes.js.map