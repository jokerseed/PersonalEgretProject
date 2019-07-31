namespace Jokerseed {
    /**
     * Controller 是整个mvc框架的控制者，它是一个单例类，
     * 为模块或视图广播命令 ICommand对象接收并处理命令提供支持
     */
    export class Controller {
        private static _instane: Controller;
        //命令map
        private _commandMap: { [key: string]: any[] };

        constructor() {
            this._commandMap = {};
        }

        public static get instance(): Controller {
            return Controller._instane || (Controller._instane = new Controller());
        }

        /**
         * 注册一个命令类对象映射到对应的消息名称上
         */
        public registerCommand(notificationName: string, commandClass: any) {
            
        }
    }
}