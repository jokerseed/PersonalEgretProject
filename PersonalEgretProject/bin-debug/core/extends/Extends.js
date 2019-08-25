egret.testExtends = function (content) {
    console.log(content);
};
var p = egret.DisplayObject.prototype;
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
//# sourceMappingURL=Extends.js.map