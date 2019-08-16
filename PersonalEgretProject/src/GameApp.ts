namespace game {
    export class GameApp extends eui.UILayer {
        protected createChildren(): void {
            super.createChildren();

            egret.lifecycle.addLifecycleListener((context) => {
                // custom lifecycle plugin
            })

            egret.lifecycle.onPause = () => {
                egret.ticker.pause();
            }

            egret.lifecycle.onResume = () => {
                egret.ticker.resume();
            }

            //inject the custom material parser
            //注入自定义的素材解析器
            let assetAdapter = new AssetAdapter();
            egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
            egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

            this.runGame().catch(e => {
                console.log(e);
            })
        }

        private async runGame() {
            await this.loadResource()
            await this.init();
            this.createGameScene();
            /**
             * 平台接入位置
             */
            // await platform.login();
            // const userInfo = await platform.getUserInfo();
            // console.log(userInfo);
        }

        private async loadResource() {
            try {
                await RES.loadConfig("resource/default.res.json", "resource/");
                await this.loadTheme();
            }
            catch (e) {
                console.error(e);
            }
        }

        //加载皮肤
        private loadTheme() {
            return new Promise((resolve, reject) => {
                // load skin theme configuration file, you can manually modify the file. And replace the default skin.
                //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
                let theme = new eui.Theme("resource/default.thm.json", this.stage);
                theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                    resolve();
                }, this);

            })
        }

        /**
         * 初始化层级
         */
        private async init() {
            layerManager.setParent(this);
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadGroup("preload", 0, loadingView);
            await RES.loadGroup("particle", 0, loadingView);
            await RES.loadGroup("altas", 0, loadingView);
            this.stage.removeChild(loadingView);
        }

        /**
         * 创建场景界面
         * Create scene interface
         */
        protected createGameScene(): void {
            socketManager.connectServer();
        }
    }
}