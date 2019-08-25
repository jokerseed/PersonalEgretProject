declare module egret {
    /**
     * 通过原型链扩展测试
     */
    function testExtends(content: string);

    export interface DisplayObject {
        myChildNum: number;
    }
}

egret.testExtends = function (content) {
    console.log(content);
};

const p = egret.DisplayObject.prototype;
Object.defineProperty(p, "myChildNum", {
    configurable: true,
    enumerable: true,
    set: function (value) {
        this.$myChildNum = value;
    },
    get: function () {
        return this.$myChildNum === void 0 ? 0 : this.$myChildNum;
    }
}); 