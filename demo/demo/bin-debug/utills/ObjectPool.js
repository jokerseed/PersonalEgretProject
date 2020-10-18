var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 对象池
 */
var ObjectPool = (function () {
    function ObjectPool() {
        /**
         * 对象池最大存储对象数量
         */
        this._maxNum = 50;
    }
    ObjectPool.getInstance = function () {
        if (!this._instance) {
            this._instance = new ObjectPool();
        }
        return this._instance;
    };
    /**
     * 存入的对象需要初始化
     * @param 回收对象的实例
     */
    ObjectPool.prototype.pushPool = function (obj) {
        var clazz = egret.getQualifiedClassName(obj);
        if (!ObjectPool.pool) {
            ObjectPool.pool = {};
        }
        if (!ObjectPool.pool[clazz]) {
            ObjectPool.pool[clazz] = [];
        }
        ObjectPool.pool[clazz].push(obj);
    };
    /**
     * @param 要取得实例的类
     */
    ObjectPool.prototype.popPool = function (obj) {
        var clazz = egret.getQualifiedClassName(obj);
        if (!ObjectPool.pool || !ObjectPool.pool[clazz] || ObjectPool.pool[clazz].length <= 0) {
            return new obj();
        }
        else {
            return ObjectPool.pool[clazz].shift();
        }
    };
    return ObjectPool;
}());
__reflect(ObjectPool.prototype, "ObjectPool");
//# sourceMappingURL=ObjectPool.js.map