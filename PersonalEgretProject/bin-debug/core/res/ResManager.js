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
    var ResManager = (function (_super) {
        __extends(ResManager, _super);
        function ResManager() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * 加载资源配置文件
         */
        ResManager.prototype.loadConfig = function (url, resourceRoot) {
            var self = this;
            RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, self.onConfigComplete, self);
            RES.loadConfig(url, resourceRoot);
        };
        ResManager.prototype.onConfigComplete = function (event) {
            var self = this;
            RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, self.onConfigComplete, self);
        };
        /**
         * 加载资源组
         */
        ResManager.prototype.loadGroup = function (name, priority) {
            if (priority === void 0) { priority = 0; }
            var self = this;
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, self.onGroupComplete, self);
            RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, self.onGroupLoadError, self);
            RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, self.onGroupProgress, self);
            RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, self.onItemLoadError, self);
            RES.loadGroup(name, priority);
        };
        ResManager.prototype.onGroupComplete = function (event) {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onGroupComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onGroupLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onGroupProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        };
        ResManager.prototype.onGroupLoadError = function (event) {
            console.warn("Group:" + event.groupName + " has failed to load");
        };
        ResManager.prototype.onGroupProgress = function (event) {
        };
        ResManager.prototype.onItemLoadError = function (event) {
            console.warn("Url:" + event.resItem.url + " has failed to load");
        };
        return ResManager;
    }(egret.EventDispatcher));
    game.ResManager = ResManager;
    __reflect(ResManager.prototype, "game.ResManager");
    game.resManager = new ResManager();
})(game || (game = {}));
//# sourceMappingURL=ResManager.js.map