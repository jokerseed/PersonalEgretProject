namespace Jokerseed {
    export interface INotifier {
        /**
         * 发送事件
         */
        dispatch(notificationName: string, ...args);
    }

    export interface IObserver {
        /**
         * 添加监听消息
         */
        addListener(notificationName: string, callBack: Function, thisObject?: any);

        /**
         * 移除监听
         */
        removeListener(notificationName: string, callBack: Function, thisObj?: any);
    }

    export interface ICommand {
        /**
         * 命令执行
         */
        execute(notificationName: string, ...args);
    }

    export interface IProxy {

    }

    export interface IMediator extends IObserver {
        
    }
}