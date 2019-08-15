namespace game {
    export class ResManager extends egret.EventDispatcher {
        /**
         * 加载资源配置文件
         */
        public loadConfig(url: string, resourceRoot: string) {
            let self = this;
            RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, self.onConfigComplete, self);
            RES.loadConfig(url, resourceRoot);
        }

        private onConfigComplete(event: RES.ResourceEvent) {
            let self = this;
            RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, self.onConfigComplete, self);
        }

        /**
         * 加载资源组
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
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onGroupComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onGroupLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onGroupProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        }

        private onGroupLoadError(event: RES.ResourceEvent) {
            console.warn("Group:" + event.groupName + " has failed to load");
        }

        private onGroupProgress(event: RES.ResourceEvent) {

        }

        private onItemLoadError(event: RES.ResourceEvent) {
            console.warn("Url:" + event.resItem.url + " has failed to load");
        }
    }

    export let resManager = new ResManager();
}