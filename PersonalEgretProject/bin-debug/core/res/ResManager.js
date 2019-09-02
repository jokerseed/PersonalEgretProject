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
         * 加载资源配置文件default.res.json
         * RES.loadConfig()通常应写在整个游戏最开始初始化的地方，并且只执行一次
         * "resource/default.res.json"         "resource/"
         */
        ResManager.prototype.loadConfig = function (url, resourceRoot) {
            var self = this;
            RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, self.onConfigComplete, self);
            RES.addEventListener(RES.ResourceEvent.CONFIG_LOAD_ERROR, self.onConfigError, self);
            RES.loadConfig(url, resourceRoot);
        };
        ResManager.prototype.onConfigComplete = function (event) {
            var self = this;
            RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, self.onConfigComplete, self);
            RES.removeEventListener(RES.ResourceEvent.CONFIG_LOAD_ERROR, self.onConfigError, self);
        };
        ResManager.prototype.onConfigError = function (event) {
            var self = this;
        };
        /**
         * 加载资源组
         * 可能有多个资源组在同时加载
         * 由于网络原因资源加载失败，可设置重新加载    有可能网络失去连接，可设置一个标志位，记录加载次数，一定次数后提示网络连接中断
         * priority参数越大，就会先加载
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
            var self = this;
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, self.onGroupComplete, self);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, self.onGroupLoadError, self);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, self.onGroupProgress, self);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, self.onItemLoadError, self);
        };
        ResManager.prototype.onGroupLoadError = function (event) {
            console.warn("Group:" + event.groupName + " has failed to load");
        };
        ResManager.prototype.onGroupProgress = function (event) {
        };
        ResManager.prototype.onItemLoadError = function (event) {
            console.warn("Url:" + event.resItem.url + " has failed to load");
        };
        /**
         * 动态创建资源组
         * groupName组名
         * keys可以是配置好的资源名也可以是资源组名
         */
        ResManager.prototype.createGroup = function (groupName, keys) {
            return RES.createGroup(groupName, keys);
        };
        /**
         * 清除资源缓存
         * @param 资源名字
         * @param 资源组名
         * @param 资源路径
         */
        ResManager.prototype.rmvRes = function (nameOrUrl) {
            RES.destroyRes(name);
        };
        return ResManager;
    }(egret.EventDispatcher));
    game.ResManager = ResManager;
    __reflect(ResManager.prototype, "game.ResManager");
    game.resManager = new ResManager();
})(game || (game = {}));
//# sourceMappingURL=ResManager.js.map