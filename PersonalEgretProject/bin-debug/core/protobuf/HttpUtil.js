var game;
(function (game) {
    var HttpUtil;
    (function (HttpUtil) {
        function accLogin(args, showBusy, cb, target) {
            var url = md5(args.urlKey);
            if (CONF.isNative) {
                var postData = args.nm + ':' + args.channel + ':' + args.agentId + ':' + args.hardwareId + ':' + url + ':' + args.clientIp + ':' + args.packAgeTp;
                reqURL("/Web/WebLogin.aspx", makeSign(postData), showBusy, cb, target);
            }
            else {
                var postData = args.nm + ':' + args.channel + ':' + args.agentId + ':' + url + ':' + args.clientIp + ':' + args.packAgeTp;
                reqURL("/Web/WebLogin2.aspx", makeSign(postData), showBusy, cb, target);
            }
        }
        HttpUtil.accLogin = accLogin;
        function serverList(args, showBusy, cb, target) {
            var postData = makeSign(args.nm);
            reqURL("/Web/ServerList.aspx", postData, showBusy, cb, target);
        }
        HttpUtil.serverList = serverList;
        function checkCode(args, showBusy, cb, target) {
            var postData = args.phone + ':' + args.agentId + ':' + args.opType + ':' + args.channel + ':' + args.playId;
            reqURL("/Web/WebCode.aspx", makeSign(postData), showBusy, cb, target);
        }
        HttpUtil.checkCode = checkCode;
        function resetPwd(args, showBusy, cb, target) {
            var signedPsw = args.pwd;
            var data = args.agentId + ':' + args.hardwareId + ':' + args.channel + ':' + args.phone + ':' + signedPsw + ':' + args.checkcode;
            reqURL("/Web/WebResetPwd.aspx", makeSign(data), showBusy, cb, target);
        }
        HttpUtil.resetPwd = resetPwd;
        function regAcc(args, showBusy, cb, target) {
            var signedPsw = args.pwd;
            var url = md5(args.urlKey);
            var data = args.phone + ':' + args.checkcode + ':' + signedPsw + ':' + args.channel + ':' + args.agentId + ':' + args.hardwareId + ':' + url + ':' + args.clientIp + ':' + args.packAgeTp;
            reqURL("/Web/WebRegAccount.aspx", makeSign(data), showBusy, cb, target);
        }
        HttpUtil.regAcc = regAcc;
        function loginAcc(args, showBusy, cb, target) {
            var signedPsw = args.pwd;
            var url = md5(args.urlKey);
            var data = args.phone + ':' + signedPsw + ':' + args.channel + ':' + args.agentId + ':' + args.hardwareId + ':' + url + ':' + args.clientIp;
            reqURL("/Web/WebPhoneLogin.aspx", makeSign(data), showBusy, cb, target);
        }
        HttpUtil.loginAcc = loginAcc;
        function bindAcc(args, showBusy, cb, target) {
            var signedPsw = args.pwd;
            var data = args.nm + ':' + args.phone + ':' + args.checkcode + ':' + signedPsw + ':' + args.agentId + ':' + args.hardwareId;
            reqURL("/Web/WebBindAccount.aspx", makeSign(data), showBusy, cb, target);
        }
        HttpUtil.bindAcc = bindAcc;
        function CheckNotice(args, showBusy, cb, target) {
            var data = "agentId=" + args.agentId;
            reqURL("/Server/CheckNotice.aspx", data, showBusy, cb, target);
        }
        HttpUtil.CheckNotice = CheckNotice;
        // export function getIp( showBusy:boolean, cb:Function, target:any ){
        //     reqURL( "/service/getIpInfo.php", "ip=myip", showBusy, cb, target,CONF.taotaoUrl);
        // }
        // export function sendLogInfo(info:any,showBusy:boolean, cb:Function, target:any ){
        //     let data = "info=" + info;
        //     reqURL( "/LogService/LogIpInfo.aspx", data,showBusy, cb, target);
        // }
        /**
         *
         * @param args
         *  playerId 玩家ID，若还没获取到,传空
            hardwareId  设备号,网页端传空
            channelId 包的渠道号
            url  如果是http访问的过程中出错，这里填请求的地址
            error  具体错误内容
            ip  本机IP
            gameId  若是在子游戏内报错,填游戏ID
            gameVer 子游戏版本号
            lobbyVer 大厅版本号
            clientVer 包的版本号
         * @param showBusy
         * @param cb
         * @param target
         */
        function webLogInfo(args) {
            // let baseError = Base64.base64Encode(args.error);
            // let clientVer = CONF.gameVer;
            // let hardwareId = CONF.deviceId;
            // let channel = CONF.channelId;
            // let clientIp = CONF.clientIp;
            // let data = args.playId + ":" + hardwareId + ":" + channel + ":" + "" + ":" + baseError + ":" + clientIp + ":" + args.gameId + ":" +  args.gameVer + ":" + "" + ":" + clientVer ;
            // reqURL( "/LogService/WebErrorInfo.aspx", makeSign(data),false, function(){}, this);
            var info = args;
            info.clientVer = CONF.gameVer;
            info.channelId = CONF.channelId;
            info.ip = CONF.clientIp;
            info.info = args.error;
            info.deviceId = CONF.deviceId;
            delete args.error;
            var infoStr = Base64.base64Encode(JSON.stringify(info));
            infoStr = JSON.stringify({ records: [{ value: infoStr }] });
            var request = new egret.HttpRequest();
            request.setRequestHeader("Content-Type", "application/json");
            request.open(CONF.logUrl, egret.HttpMethod.POST);
            request.send(infoStr);
        }
        HttpUtil.webLogInfo = webLogInfo;
        function channelCfgInfo(args, showBusy, cb, target) {
            var data = args.agentId + ":" + args.channelId;
            reqURL("/Server/GetChannelConfig.aspx", makeSign(data), showBusy, cb, target);
        }
        HttpUtil.channelCfgInfo = channelCfgInfo;
        function gotoKeFu() {
            URLUtil.checkDeviceID(function () {
                var uid = "";
                var uname = "游客";
                var token = "";
                //let avatar = StringUtil.printf(tempUrl, "static/img/female.a384e7e.jpg");
                var avatar = "head_nan_3.png";
                var agentId = CONF.agentId;
                var data = dataMgr.accMo.getData();
                var theme = GameUtil.getAllSkinId();
                if (data != null) {
                    uid = data.aid.toString();
                    uname = data.nickname;
                    token = data.cs_token;
                    avatar = data.icon_custom;
                }
                //let tempSign = StringUtil.printf(uid, agentId, deviceID, encodeURI(uname), encodeURI(avatar), "3C3831AD16D3A32AD8E26CEB505DB57D");
                var urlCode1 = encodeURIComponent(uname).toLowerCase();
                var urlCode2 = encodeURIComponent(avatar).toLowerCase();
                var tempSign = uid + agentId + CONF.deviceId + urlCode1 + urlCode2 + theme + "3C3831AD16D3A32AD8E26CEB505DB57D";
                var sign = md5(tempSign);
                var url = CONF.kefuUrl +
                    "?uid=" + uid +
                    "&uname=" + urlCode1 +
                    "&agentid=" + agentId +
                    "&avatar=" + urlCode2 +
                    "&theme=" + theme +
                    "&sign=" + sign +
                    "&mac=" + CONF.deviceId +
                    "&token=" + token;
                URLUtil.openURL(url, { orientation: "portait", usecache: true, showloading: true });
            });
        }
        HttpUtil.gotoKeFu = gotoKeFu;
        function askCreateImg(args, showBusy, cb, target) {
            var data = Base64.base64Encode(args.link);
            var postData = makeSign(data);
            reqURL("/QrCode/WebCreateQr.aspx", postData, showBusy, cb, target);
        }
        HttpUtil.askCreateImg = askCreateImg;
        function makeSign(data) {
            var sign = md5(data + "8DB1C7CE26C2A748FA3627410DB0FB0F");
            return "data=" + data + "&sign=" + sign;
        }
        function sendLocation() {
            var myID = game.dataMgr.accMo.getData().aid;
            var key = "Location" + myID;
            var val = GameUtil.getLocal(key);
            if (val) {
            }
            else {
                URLUtil.getClipboardText(function (datas) {
                    var txt;
                    if (datas) {
                        var temp = URLUtil.getLocationValue(datas);
                        var clipRecommendId = temp.RecommendId || "";
                        var clipChannelId = temp.ChannelId || "";
                        txt = "PlayerId=" + myID + "&PackageChannelId=" + CONF.shareId + "&clipRecommendId=" + clipRecommendId + "&clipChannelId=" + clipChannelId;
                    }
                    else {
                        txt = "PlayerId=" + myID + "&PackageChannelId=" + CONF.shareId;
                    }
                    reqURL("location", txt, false, function () {
                        var tempKey = "myID";
                        GameUtil.setLocal(key, tempKey);
                    }, self, CONF.location);
                });
            }
        }
        HttpUtil.sendLocation = sendLocation;
        function reqURL(url, data, showBusy, cb, target, svrUrl) {
            var request = new egret.HttpRequest();
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            //request.responseType = egret.HttpResponseType.TEXT;
            request.open((svrUrl || CONF.svrUrl) + url + "?" + data, egret.HttpMethod.GET);
            request.addEventListener(egret.Event.COMPLETE, function (e) {
                if (showBusy && HttpUtil.busyUI)
                    HttpUtil.busyUI.hideBusy();
                var req = e.currentTarget;
                var data = JSON.parse(req.response);
                if (cb)
                    cb.call(target, data);
            }, this);
            request.addEventListener(egret.IOErrorEvent.IO_ERROR, function (e) {
                if (showBusy && HttpUtil.busyUI)
                    HttpUtil.busyUI.hideBusy();
                if (cb)
                    cb.call(target);
            }, this);
            if (showBusy && HttpUtil.busyUI)
                HttpUtil.busyUI.showBusy();
            request.send();
        }
        HttpUtil.reqURL = reqURL;
    })(HttpUtil = game.HttpUtil || (game.HttpUtil = {}));
})(game || (game = {}));
//# sourceMappingURL=HttpUtil.js.map