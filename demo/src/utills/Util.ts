class Util {
    public static stageWidth: number = 0;
    public static stageHeight: number = 0;

    private static _instance: Util;

    private constructor() { }

    public static getInstance(): Util {
        if (!this._instance) {
            this._instance = new Util();
        }
        return this._instance;
    }

    public setStageSize(width: number, height: number) {
        Util.stageWidth = width;
        Util.stageHeight = height;
        console.log("屏幕宽高:" + Util.stageWidth + "," + Util.stageHeight);
    }
}