module game {
    /**
     * Timer
     * 两个属性是 delay 与 repeatCount ,分别表示每次间隔的时间（以毫秒为单位）和执行的次数（如果次数为0，则表示不停的执行）
     * 三个方法为 start, reset 和 stop。作用分别是开始计时，重新计时和暂停计时
     * 两个事件分别为 TimerEvent.TIMER 和 TimerEvent.TIMER_COMPLETE 。分别在计时过程中触发和计时结束后触发。
     */
    export class TimeManager {
        public timer: egret.Timer;

        //Timer计时器               可用作倒计时
        public createTimer(time: number, count: number) {
            let self = this;
            let timer = self.timer;
            timer = new egret.Timer(time, count);
            timer.addEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
            timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.timerComFunc, this);
            timer.start();
        }

        private timerFunc() {
            console.log("计时");
        }

        private timerComFunc() {
            console.log("计时结束");
        }
    }

    /**
     * enter_frame
     * 帧事件enter_frame在下一帧开始时回调。所以他的回调速度和帧率有关
     * 还得要继承容器类。。。。。
     */
    export class TimeManager2 extends egret.DisplayObjectContainer {
        public timeOnEnterFrame: number = 0;

        //帧事件
        public startEnterFrame() {
            let self = this;
            self.addEventListener(egret.Event.ENTER_FRAME, self.onEnterFrame, self);
            self.timeOnEnterFrame = egret.getTimer();
        }

        private onEnterFrame(event: egret.Event) {
            let self = this;
            let now = egret.getTimer();
            let time = self.timeOnEnterFrame;
            let pass = now - time;
            console.log("onEnterFrame:", (1000 / pass).toFixed(5));
            self.timeOnEnterFrame = egret.getTimer();
        }
    }

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
    export class TimeManager3 {
        public time: number = 0;

        public start() {
            let self = this;
            self.time = egret.getTimer();
            egret.startTick(self.moveStar, self);
        }

        private moveStar(timeStamp: number): boolean {
            let self = this;
            let now = timeStamp;
            let time = self.time;
            let pass = now - time;
            // console.log("moveStar:", (1000 / pass).toFixed(5));
            console.log("timeStamp:" + timeStamp);
            self.time = now;
            return false;
        }

        public stop() {
            let self = this;
            egret.stopTick(self.moveStar, self);
        }
    }

    export const timeManager = new TimeManager();
    export const timeManager2 = new TimeManager2();
    export const timeManager3 = new TimeManager3();
}