namespace game {
    export class ResManager extends egret.EventDispatcher {
        public callBack: Function;

        /**
         * 加载资源配置文件default.res.json
         * RES.loadConfig()通常应写在整个游戏最开始初始化的地方，并且只执行一次
         * "resource/default.res.json"         "resource/"
         */
        public loadConfig(url: string, resourceRoot: string) {
            let self = this;
            RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, self.onConfigComplete, self);
            RES.addEventListener(RES.ResourceEvent.CONFIG_LOAD_ERROR, self.onConfigError, self);
            RES.loadConfig(url, resourceRoot);
        }

        private onConfigComplete(event: RES.ResourceEvent) {
            let self = this;
            RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, self.onConfigComplete, self);
            RES.removeEventListener(RES.ResourceEvent.CONFIG_LOAD_ERROR, self.onConfigError, self);
        }

        private onConfigError(event: RES.ResourceEvent) {
            let self = this;
        }

        /**
         * 加载资源组
         * 可能有多个资源组在同时加载
         * 由于网络原因资源加载失败，可设置重新加载    有可能网络失去连接，可设置一个标志位，记录加载次数，一定次数后提示网络连接中断
         * priority参数越大，就会先加载
         */
        public loadGroup(name: string, priority: number = 0) {
            let self = this;
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, self.onGroupComplete, self);
            RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, self.onGroupLoadError, self);
            RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, self.onGroupProgress, self);
            RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, self.onItemLoadError, self);
            RES.loadGroup(name, priority);
        }

        private onGroupComplete(event: RES.ResourceEvent) {
            let self = this;
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, self.onGroupComplete, self);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, self.onGroupLoadError, self);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, self.onGroupProgress, self);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, self.onItemLoadError, self);
        }

        private onGroupLoadError(event: RES.ResourceEvent) {
            console.warn("Group:" + event.groupName + " has failed to load");
        }

        private onGroupProgress(event: RES.ResourceEvent) {

        }

        private onItemLoadError(event: RES.ResourceEvent) {
            console.warn("Url:" + event.resItem.url + " has failed to load");
        }

        /**
         * 动态创建资源组
         * groupName组名
         * keys可以是配置好的资源名也可以是资源组名
         */
        public createGroup(groupName: string, keys: string[]): boolean {
            return RES.createGroup(groupName, keys);
        }

        /**
         * 清除资源缓存
         * @param 资源名字
         * @param 资源组名
         * @param 资源路径
         */
        public rmvRes(nameOrUrl: string) {
            RES.destroyRes(name);
        }
    }

    export let resManager = new ResManager();
}