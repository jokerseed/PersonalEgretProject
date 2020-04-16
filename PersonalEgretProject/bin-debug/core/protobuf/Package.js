var game;
(function (game) {
    var Package;
    (function (Package) {
        function encode(msgId, len, buf) {
            buf.writeInt(msgId);
            buf.writeShort(len);
        }
        Package.encode = encode;
        function decode(data) {
            var msgId = data.readInt();
            var msgLen = data.readShort();
            return { id: msgId, len: msgLen };
        }
        Package.decode = decode;
    })(Package = game.Package || (game.Package = {}));
})(game || (game = {}));
//# sourceMappingURL=Package.js.map