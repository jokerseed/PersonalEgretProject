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
    /**
     * Timer
     * 两个属性是 delay 与 repeatCount ,分别表示每次间隔的时间（以毫秒为单位）和执行的次数（如果次数为0，则表示不停的执行）
     * 三个方法为 start, reset 和 stop。作用分别是开始计时，重新计时和暂停计时
     * 两个事件分别为 TimerEvent.TIMER 和 TimerEvent.TIMER_COMPLETE 。分别在计时过程中触发和计时结束后触发。
     */
    var TimeManager = (function () {
        function TimeManager() {
        }
        //Timer计时器               可用作倒计时
        TimeManager.prototype.createTimer = function (time, count) {
            var self = this;
            var timer = self.timer;
            timer = new egret.Timer(time, count);
            timer.addEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
            timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.timerComFunc, this);
            timer.start();
        };
        TimeManager.prototype.timerFunc = function () {
            console.log("计时");
        };
        TimeManager.prototype.timerComFunc = function () {
            console.log("计时结束");
        };
        return TimeManager;
    }());
    game.TimeManager = TimeManager;
    __reflect(TimeManager.prototype, "game.TimeManager");
    /**
     * enter_frame
     * 帧事件enter_frame在下一帧开始时回调。所以他的回调速度和帧率有关
     * 还得要继承容器类。。。。。
     */
    var TimeManager2 = (function (_super) {
        __extends(TimeManager2, _super);
        function TimeManager2() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.timeOnEnterFrame = 0;
            return _this;
        }
        //帧事件
        TimeManager2.prototype.startEnterFrame = function () {
            var self = this;
            self.addEventListener(egret.Event.ENTER_FRAME, self.onEnterFrame, self);
            self.timeOnEnterFrame = egret.getTimer();
        };
        TimeManager2.prototype.onEnterFrame = function (event) {
            var self = this;
            var now = egret.getTimer();
            var time = self.timeOnEnterFrame;
            var pass = now - time;
            console.log("onEnterFrame:", (1000 / pass).toFixed(5));
            self.timeOnEnterFrame = egret.getTimer();
        };
        return TimeManager2;
    }(egret.DisplayObjectContainer));
    game.TimeManager2 = TimeManager2;
    __reflect(TimeManager2.prototype, "game.TimeManager2");
    /**
     * Ticker心跳
     * startTick(停止对应stopTick)全局函数将以60帧速率回调函数
     * 与enter_frame不同，enter_frame是每帧回调，改变帧率会改变回调速度；
     * startTick是定时回调，改变帧率也不会应影响回调速度
     *
     * startTick 函数有两个传入参数，第一个参数是回调函数，该回调函数要求有返回值，
     * 如果返回为true将在回调函数执行完成之后立即重绘，
     * 为false则不会重绘。第二个参数是this对象，通常传入this即可。
     */
    var TimeManager3 = (function () {
        function TimeManager3() {
            this.time = 0;
        }
        TimeManager3.prototype.start = function () {
            var self = this;
            self.time = egret.getTimer();
            egret.startTick(self.moveStar, self);
        };
        TimeManager3.prototype.moveStar = function (timeStamp) {
            var self = this;
            var now = timeStamp;
            var time = self.time;
            var pass = now - time;
            // console.log("moveStar:", (1000 / pass).toFixed(5));
            console.log("timeStamp:" + timeStamp);
            self.time = now;
            return false;
        };
        TimeManager3.prototype.stop = function () {
            var self = this;
            egret.stopTick(self.moveStar, self);
        };
        return TimeManager3;
    }());
    game.TimeManager3 = TimeManager3;
    __reflect(TimeManager3.prototype, "game.TimeManager3");
    game.timeManager = new TimeManager();
    game.timeManager2 = new TimeManager2();
    game.timeManager3 = new TimeManager3();
})(game || (game = {}));
//# sourceMappingURL=TimeManager.js.map