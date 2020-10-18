/**
 * 对象池
 */
class ObjectPool {
    public static pool: { [className: string]: Object[] };

    /**
     * 对象池最大存储对象数量
     */
    private _maxNum: number = 50;
    private static _instance: ObjectPool;

    private constructor() { }

    public static getInstance(): ObjectPool {
        if (!this._instance) {
            this._instance = new ObjectPool();
        }
        return this._instance;
    }

    /**
     * 存入的对象需要初始化
     * @param 回收对象的实例
     */
    public pushPool(obj: any) {
        let clazz = egret.getQualifiedClassName(obj);
        if (!ObjectPool.pool) {
            ObjectPool.pool = {};
        }
        if (!ObjectPool.pool[clazz]) {
            ObjectPool.pool[clazz] = [];
        }
        ObjectPool.pool[clazz].push(obj);
    }

    /**
     * @param 要取得实例的类
     */
    public popPool(obj: any) {
        let clazz = egret.getQualifiedClassName(obj);
        if (!ObjectPool.pool || !ObjectPool.pool[clazz] || ObjectPool.pool[clazz].length <= 0) {
            return new obj();
        } else {
            return ObjectPool.pool[clazz].shift();
        }
    }
}