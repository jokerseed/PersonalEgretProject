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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var game;
(function (game) {
    var GameApp = (function (_super) {
        __extends(GameApp, _super);
        function GameApp() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GameApp.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            egret.lifecycle.addLifecycleListener(function (context) {
                // custom lifecycle plugin
            });
            egret.lifecycle.onPause = function () {
                egret.ticker.pause();
            };
            egret.lifecycle.onResume = function () {
                egret.ticker.resume();
            };
            //inject the custom material parser
            //注入自定义的素材解析器
            var assetAdapter = new AssetAdapter();
            egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
            egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
            this.runGame().catch(function (e) {
                console.log(e);
            });
        };
        GameApp.prototype.runGame = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.loadResource()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.init()];
                        case 2:
                            _a.sent();
                            this.createGameScene();
                            return [2 /*return*/];
                    }
                });
            });
        };
        GameApp.prototype.loadResource = function () {
            return __awaiter(this, void 0, void 0, function () {
                var e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, RES.loadConfig("resource/default.res.json", "resource/")];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.loadTheme()];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            e_1 = _a.sent();
                            console.error(e_1);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        //加载皮肤
        GameApp.prototype.loadTheme = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                // load skin theme configuration file, you can manually modify the file. And replace the default skin.
                //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
                var theme = new eui.Theme("resource/default.thm.json", _this.stage);
                theme.addEventListener(eui.UIEvent.COMPLETE, function () {
                    resolve();
                }, _this);
            });
        };
        /**
         * 初始化层级
         */
        GameApp.prototype.init = function () {
            return __awaiter(this, void 0, void 0, function () {
                var loadingView;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            game.layerManager.setParent(this);
                            loadingView = new LoadingUI();
                            this.stage.addChild(loadingView);
                            return [4 /*yield*/, RES.loadGroup("preload", 0, loadingView)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, RES.loadGroup("particle", 0, loadingView)];
                        case 2:
                            _a.sent();
                            this.stage.removeChild(loadingView);
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * 创建场景界面
         * Create scene interface
         */
        GameApp.prototype.createGameScene = function () {
            game.socketManager.connectServer();
        };
        return GameApp;
    }(eui.UILayer));
    game.GameApp = GameApp;
    __reflect(GameApp.prototype, "game.GameApp");
})(game || (game = {}));
//# sourceMappingURL=GameApp.js.map