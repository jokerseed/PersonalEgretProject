namespace game {
    export const enum ELayer {
        one,
        two
    }

    export class LayerManager {
        private _parent: egret.DisplayObjectContainer;
        private _one: eui.Group;
        private _two: eui.Group;

        public setParent(parent: egret.DisplayObjectContainer) {
            let self = this;
            self.init();
            self._parent = parent;
            parent.addChild(self._one);
            parent.addChild(self._two);
        }

        private init() {
            let self = this;
            let one = self._one = new eui.Group();
            one.percentWidth = one.percentHeight = 100;
            one.touchThrough = true;

            let two = self._two = new eui.Group();
            two.percentWidth = two.percentHeight = 100;
            two.touchThrough = true;
        }

        public add(index: ELayer, view: egret.DisplayObject) {
            let self = this;
            let grp = self._parent.getChildAt(index) as eui.Group;
            grp.addChild(view);
        }
    }

    export const layerManager = new LayerManager();
}