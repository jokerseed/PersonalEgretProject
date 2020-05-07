
// module game {

//     export module HttpUtil {
//         export interface ILoadShow {
//             showBusy();
//             hideBusy();
//         }

//         export let busyUI: ILoadShow;

//         export function accLogin(args: { nm: string, channel: string, agentId: string, hardwareId: string, urlKey: string, clientIp: string, packAgeTp: string }, showBusy: boolean, cb: Function, target: any) {//游客登录
//             let url = md5(args.urlKey);
//             if (CONF.isNative) {
//                 let postData = args.nm + ':' + args.channel + ':' + args.agentId + ':' + args.hardwareId + ':' + url + ':' + args.clientIp + ':' + args.packAgeTp;
//                 reqURL("/Web/WebLogin.aspx", makeSign(postData), showBusy, cb, target);
//             } else { //网页端
//                 let postData = args.nm + ':' + args.channel + ':' + args.agentId + ':' + url + ':' + args.clientIp + ':' + args.packAgeTp;
//                 reqURL("/Web/WebLogin2.aspx", makeSign(postData), showBusy, cb, target);
//             }
//         }

//         export function serverList(args: { nm: string }, showBusy: boolean, cb: Function, target: any) {
//             let postData = makeSign(args.nm);
//             reqURL("/Web/ServerList.aspx", postData, showBusy, cb, target);
//         }

//         export function checkCode(args: { phone: string, agentId: string, opType: number, channel: string, playId: string }, showBusy: boolean, cb: Function, target: any) {
//             let postData = args.phone + ':' + args.agentId + ':' + args.opType + ':' + args.channel + ':' + args.playId;
//             reqURL("/Web/WebCode.aspx", makeSign(postData), showBusy, cb, target);
//         }
//         export function resetPwd(args: { phone: string, pwd: string, checkcode: string, channel: string, agentId: string, hardwareId: string }, showBusy: boolean, cb: Function, target: any) {
//             let signedPsw = args.pwd;
//             let data = args.agentId + ':' + args.hardwareId + ':' + args.channel + ':' + args.phone + ':' + signedPsw + ':' + args.checkcode;
//             reqURL("/Web/WebResetPwd.aspx", makeSign(data), showBusy, cb, target);
//         }
//         export function regAcc(args: { phone: string, pwd: string, checkcode: string, channel: string, agentId: string, hardwareId: string, urlKey: string, clientIp: string, packAgeTp: string }, showBusy: boolean, cb: Function, target: any) {
//             let signedPsw = args.pwd;
//             let url = md5(args.urlKey);
//             let data = args.phone + ':' + args.checkcode + ':' + signedPsw + ':' + args.channel + ':' + args.agentId + ':' + args.hardwareId + ':' + url + ':' + args.clientIp + ':' + args.packAgeTp;
//             reqURL("/Web/WebRegAccount.aspx", makeSign(data), showBusy, cb, target);
//         }
//         export function loginAcc(args: { phone: string, pwd: string, channel: string, agentId: string, hardwareId: string, urlKey: string, clientIp: string }, showBusy: boolean, cb: Function, target: any) {//账号密码登录
//             let signedPsw = args.pwd;
//             let url = md5(args.urlKey);
//             let data = args.phone + ':' + signedPsw + ':' + args.channel + ':' + args.agentId + ':' + args.hardwareId + ':' + url + ':' + args.clientIp;
//             reqURL("/Web/WebPhoneLogin.aspx", makeSign(data), showBusy, cb, target);
//         }
//         export function bindAcc(args: { phone: string, pwd: string, nm: string, checkcode: string, agentId: string, hardwareId: string }, showBusy: boolean, cb: Function, target: any) {
//             let signedPsw = args.pwd;
//             let data = args.nm + ':' + args.phone + ':' + args.checkcode + ':' + signedPsw + ':' + args.agentId + ':' + args.hardwareId;
//             reqURL("/Web/WebBindAccount.aspx", makeSign(data), showBusy, cb, target);
//         }
//         export function CheckNotice(args: { agentId: string }, showBusy: boolean, cb: Function, target: any) {
//             let data = "agentId=" + args.agentId;
//             reqURL("/Server/CheckNotice.aspx", data, showBusy, cb, target);
//         }
//         // export function getIp( showBusy:boolean, cb:Function, target:any ){
//         //     reqURL( "/service/getIpInfo.php", "ip=myip", showBusy, cb, target,CONF.taotaoUrl);
//         // }
//         // export function sendLogInfo(info:any,showBusy:boolean, cb:Function, target:any ){
//         //     let data = "info=" + info;
//         //     reqURL( "/LogService/LogIpInfo.aspx", data,showBusy, cb, target);
//         // }
//         /**
//          * 
//          * @param args 
//          *  playerId 玩家ID，若还没获取到,传空
//             hardwareId  设备号,网页端传空
//             channelId 包的渠道号
//             url  如果是http访问的过程中出错，这里填请求的地址
//             error  具体错误内容
//             ip  本机IP
//             gameId  若是在子游戏内报错,填游戏ID
//             gameVer 子游戏版本号
//             lobbyVer 大厅版本号
//             clientVer 包的版本号
//          * @param showBusy 
//          * @param cb 
//          * @param target 
//          */
//         export function webLogInfo(args: { playId: number, error: string, gameId: number, gameVer: string }) {
//             // let baseError = Base64.base64Encode(args.error);
//             // let clientVer = CONF.gameVer;
//             // let hardwareId = CONF.deviceId;
//             // let channel = CONF.channelId;
//             // let clientIp = CONF.clientIp;
//             // let data = args.playId + ":" + hardwareId + ":" + channel + ":" + "" + ":" + baseError + ":" + clientIp + ":" + args.gameId + ":" +  args.gameVer + ":" + "" + ":" + clientVer ;
//             // reqURL( "/LogService/WebErrorInfo.aspx", makeSign(data),false, function(){}, this);

//             let info: any = args;
//             info.clientVer = CONF.gameVer;
//             info.channelId = CONF.channelId;
//             info.ip = CONF.clientIp;
//             info.info = args.error;
//             info.deviceId = CONF.deviceId;
//             delete args.error;

//             let infoStr = Base64.base64Encode(JSON.stringify(info));
//             infoStr = JSON.stringify({ records: [{ value: infoStr }] });

//             let request = new egret.HttpRequest();
//             request.setRequestHeader("Content-Type", "application/json");
//             request.open(CONF.logUrl, egret.HttpMethod.POST);
//             request.send(infoStr);
//         }

//         export function channelCfgInfo(args: { agentId: string, channelId: string }, showBusy: boolean, cb: Function, target: any) {
//             let data = args.agentId + ":" + args.channelId;
//             reqURL("/Server/GetChannelConfig.aspx", makeSign(data), showBusy, cb, target);
//         }
//         export function gotoKeFu() {
//             URLUtil.checkDeviceID(() => {
//                 let uid = "";
//                 let uname = "游客";
//                 let token = "";
//                 //let avatar = StringUtil.printf(tempUrl, "static/img/female.a384e7e.jpg");
//                 let avatar = "head_nan_3.png";
//                 let agentId = CONF.agentId;
//                 let data = dataMgr.accMo.getData();
//                 let theme = GameUtil.getAllSkinId();
//                 if (data != null) {
//                     uid = data.aid.toString();
//                     uname = data.nickname;
//                     token = data.cs_token;
//                     avatar = data.icon_custom;
//                 }
//                 //let tempSign = StringUtil.printf(uid, agentId, deviceID, encodeURI(uname), encodeURI(avatar), "3C3831AD16D3A32AD8E26CEB505DB57D");
//                 let urlCode1 = encodeURIComponent(uname).toLowerCase();
//                 let urlCode2 = encodeURIComponent(avatar).toLowerCase();
//                 let tempSign = uid + agentId + CONF.deviceId + urlCode1 + urlCode2 + theme + "3C3831AD16D3A32AD8E26CEB505DB57D";
//                 let sign = md5(tempSign);
//                 let url = CONF.kefuUrl +
//                     "?uid=" + uid +
//                     "&uname=" + urlCode1 +
//                     "&agentid=" + agentId +
//                     "&avatar=" + urlCode2 +
//                     "&theme=" + theme +
//                     "&sign=" + sign +
//                     "&mac=" + CONF.deviceId +
//                     "&token=" + token;
//                 URLUtil.openURL(url, { orientation: "portait", usecache: true, showloading: true });
//             });
//         }

//         export function askCreateImg(args: { playerid: string, link: string }, showBusy: boolean, cb: Function, target: any) {
//             let data = Base64.base64Encode(args.link);
//             let postData = makeSign(data);
//             reqURL("/QrCode/WebCreateQr.aspx", postData, showBusy, cb, target);
//         }

//         function makeSign(data: any) {
//             var sign = md5(data + "8DB1C7CE26C2A748FA3627410DB0FB0F");
//             return "data=" + data + "&sign=" + sign;
//         }

//         export function sendLocation() {
//             let myID = game.dataMgr.accMo.getData().aid;
//             let key = "Location" + myID;
//             let val = GameUtil.getLocal(key);
//             if (val) {

//             } else {
//                 URLUtil.getClipboardText(function (datas: any) {
//                     let txt;
//                     if (datas) {
//                         let temp = URLUtil.getLocationValue(datas);
//                         let clipRecommendId = temp.RecommendId || "";
//                         let clipChannelId = temp.ChannelId || "";
//                         txt = "PlayerId=" + myID + "&PackageChannelId=" + CONF.shareId + "&clipRecommendId=" + clipRecommendId + "&clipChannelId=" + clipChannelId;
//                     } else {
//                         txt = "PlayerId=" + myID + "&PackageChannelId=" + CONF.shareId;
//                     }
//                     reqURL("location", txt, false, function () {
//                         let tempKey = "myID";
//                         GameUtil.setLocal(key, tempKey);
//                     }, self, CONF.location);
//                 });
//             }
//         }

//         export function reqURL(url: string, data: string, showBusy: boolean, cb: Function, target: any, svrUrl?: string): void {
//             let request = new egret.HttpRequest();
//             request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
//             //request.responseType = egret.HttpResponseType.TEXT;
//             request.open((svrUrl || CONF.svrUrl) + url + "?" + data, egret.HttpMethod.GET);
//             request.addEventListener(egret.Event.COMPLETE, function (e: egret.Event) {
//                 if (showBusy && busyUI) busyUI.hideBusy();
//                 let req = <egret.HttpRequest>e.currentTarget;
//                 let data = JSON.parse(req.response);
//                 if (cb) cb.call(target, data);
//             }, this);

//             request.addEventListener(egret.IOErrorEvent.IO_ERROR, function (e) {
//                 if (showBusy && busyUI) busyUI.hideBusy();
//                 if (cb) cb.call(target);
//             }, this);

//             if (showBusy && busyUI) busyUI.showBusy();

//             request.send();
//         }
//     }
// }

