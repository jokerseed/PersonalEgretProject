namespace game {
    export class ViewManager {
        private static _instance: ViewManager;

        public static get instance(): ViewManager {
            return ViewManager._instance || (ViewManager._instance = new ViewManager());
        }
    }
}