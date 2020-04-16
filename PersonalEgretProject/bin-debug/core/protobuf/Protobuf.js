var game;
(function (game) {
    var Protobuf;
    (function (Protobuf) {
        function addEncodeProtos(routeProtos, typeProtos) {
            Encoder.add(routeProtos, typeProtos);
        }
        Protobuf.addEncodeProtos = addEncodeProtos;
        function rmvEncodeProtos(routeProtos, typeProtos) {
            Encoder.rmv(routeProtos, typeProtos);
        }
        Protobuf.rmvEncodeProtos = rmvEncodeProtos;
        function addDecodeProtos(routeProtos, typeProtos) {
            Decoder.add(routeProtos, typeProtos);
        }
        Protobuf.addDecodeProtos = addDecodeProtos;
        function rmvDecodeProtos(routeProtos, typeProtos) {
            Decoder.rmv(routeProtos, typeProtos);
        }
        Protobuf.rmvDecodeProtos = rmvDecodeProtos;
        function encode(msgId, data, buff) {
            return Encoder.encode(msgId, data, buff);
        }
        Protobuf.encode = encode;
        function decode(msgId, len, data) {
            return Decoder.decode(msgId, len, data);
        }
        Protobuf.decode = decode;
        function getProto(protoList, id) {
            for (var i = protoList.length - 1; i >= 0; i--) {
                var tyProtos = protoList[i][id];
                if (tyProtos)
                    return tyProtos;
            }
            return null;
        }
        //--------------------------------------------------------
        var Encoder;
        (function (Encoder) {
            var _routeProtos = [];
            var _tpProtos = [];
            var _tmpProtos = {};
            function add(routeProtos, typeProtos) {
                _routeProtos.push(routeProtos);
                if (typeProtos) {
                    if (true && _tpProtos.length > 0) {
                        for (var key in typeProtos) {
                            if (parseInt(key) < 30) {
                                egret.error("协议错误：请检查协议批处理(.bat)文件中的 游戏ID 是否设置");
                            }
                            break;
                        }
                    }
                    _tpProtos.push(typeProtos);
                }
            }
            Encoder.add = add;
            function rmv(routeProtos, typeProtos) {
                var idx = _routeProtos.indexOf(routeProtos);
                if (idx >= 0)
                    _routeProtos.splice(idx, 1);
                if (typeProtos) {
                    idx = _tpProtos.indexOf(typeProtos);
                    if (idx >= 0) {
                        _tpProtos.splice(idx, 1);
                        _tmpProtos = {};
                    }
                }
            }
            Encoder.rmv = rmv;
            function encode(route, msg, buff) {
                // Get protos from protos map use the route as key
                var protos = getProto(_routeProtos, route);
                if (!protos) {
                    console.error("error: route=" + route + "  protos not exist");
                    return;
                }
                encodeMsg(buff, protos, msg);
                return buff;
            }
            Encoder.encode = encode;
            function encodeMsg(buff, protos, msg) {
                for (var name_1 in msg) {
                    var proto = protos[name_1];
                    if (proto) {
                        var protoTp = proto[1 /* type */];
                        var tag = makeTag(protoTp, proto[0 /* tag */]);
                        var val = msg[name_1];
                        if (proto[3 /* isArr */]) {
                            encodeArray(buff, protoTp, val, tag);
                        }
                        else {
                            Coder.writeUInt32(buff, tag);
                            encodeProp(buff, protoTp, val);
                        }
                    }
                }
            }
            function encodeProp(buff, protoTp, value) {
                switch (protoTp) {
                    case 0 /* uint32 */:
                        Coder.writeUInt32(buff, value);
                        break;
                    case 1 /* int32 */:
                        Coder.writeInt32(buff, value);
                        break;
                    case 2 /* bool */:
                        Coder.writeBool(buff, value);
                        break;
                    case 3 /* int64 */:
                        Coder.writeInt64(buff, value);
                        break;
                    case 5 /* string */:
                        var byteLen = utf8.length(value);
                        Coder.writeUInt32(buff, byteLen);
                        utf8.write(value, buff);
                        break;
                    default:
                        var tmpProtos = getTpProto(protoTp);
                        var subBuff = new egret.ByteArray();
                        encodeMsg(subBuff, tmpProtos, value);
                        Coder.writeUInt32(buff, subBuff.length);
                        buff.writeBytes(subBuff);
                        break;
                }
            }
            function getTpProto(protoTp) {
                var tmpProtos = _tmpProtos[protoTp];
                if (!tmpProtos) {
                    var tpProtos = getProto(_tpProtos, protoTp);
                    tmpProtos = {};
                    for (var key in tpProtos) {
                        var protoInfo = tpProtos[key].slice(0);
                        var protoKey = protoInfo[0];
                        protoInfo[0] = parseInt(key);
                        tmpProtos[protoKey] = protoInfo;
                    }
                    _tmpProtos[protoTp] = tmpProtos;
                }
                return tmpProtos;
            }
            function encodeArray(buff, protoTp, valArr, tag) {
                var i = 0, arrLen = valArr.length;
                //if( protoTp<ProtoType.msgstart ){
                // Coder.writeUInt32(buff, tag);
                // Coder.writeUInt32(buff, arrLen );
                switch (protoTp) {
                    case 0 /* uint32 */:
                        for (; i < arrLen; ++i) {
                            Coder.writeUInt32(buff, tag);
                            Coder.writeUInt32(buff, valArr[i]);
                        }
                        break;
                    case 1 /* int32 */:
                        for (; i < arrLen; ++i) {
                            Coder.writeUInt32(buff, tag);
                            Coder.writeInt32(buff, valArr[i]);
                        }
                        break;
                    case 2 /* bool */:
                        for (; i < arrLen; ++i) {
                            Coder.writeUInt32(buff, tag);
                            Coder.writeBool(buff, valArr[i]);
                        }
                        break;
                    case 3 /* int64 */:
                        for (; i < arrLen; ++i) {
                            Coder.writeUInt32(buff, tag);
                            Coder.writeInt64(buff, valArr[i]);
                        }
                        break;
                    case 5 /* string */:
                        for (; i < arrLen; ++i) {
                            Coder.writeUInt32(buff, tag);
                            var str = valArr[i];
                            var byteLen = utf8.length(str);
                            Coder.writeUInt32(buff, byteLen);
                            utf8.write(str, buff);
                        }
                        break;
                    default:
                        var tmpProtos = getTpProto(protoTp);
                        for (; i < arrLen; ++i) {
                            Coder.writeUInt32(buff, tag);
                            var subBuff = new egret.ByteArray();
                            encodeMsg(subBuff, tmpProtos, valArr[i]);
                            Coder.writeUInt32(buff, subBuff.length);
                            buff.writeBytes(subBuff);
                        }
                }
                //}
                // else{
                //     let tyProtos = _tpProtos[protoTp];
                //     for( ; i<arrLen; ++i ){
                //         Coder.writeVarint32(buff, tag);
                //         encodeMsg(opData, tyProtos, valArr[i]);
                //     }
                // }
            }
            function makeTag(type, tag) {
                var wireTp = 2;
                switch (type) {
                    case 0 /* uint32 */:
                    case 1 /* int32 */:
                    case 2 /* bool */:
                    case 3 /* int64 */:
                        wireTp = 0;
                        break;
                }
                return (tag << 3) | wireTp;
            }
        })(Encoder || (Encoder = {}));
        //----------------------------------------------------------------
        var Decoder;
        (function (Decoder) {
            var _routeProtos = [];
            var _tpProtos = [];
            function add(routeProtos, typeProtos) {
                _routeProtos.push(routeProtos);
                if (typeProtos) {
                    if (true && _tpProtos.length > 0) {
                        for (var key in typeProtos) {
                            if (parseInt(key) < 30) {
                                egret.error("协议错误：请检查协议批处理(.bat)文件中的 游戏ID 是否设置");
                            }
                            break;
                        }
                    }
                    _tpProtos.push(typeProtos);
                }
            }
            Decoder.add = add;
            function rmv(routeProtos, typeProtos) {
                var idx = _routeProtos.indexOf(routeProtos);
                if (idx >= 0)
                    _routeProtos.splice(idx, 1);
                if (typeProtos) {
                    idx = _tpProtos.indexOf(typeProtos);
                    if (idx >= 0)
                        _tpProtos.splice(idx, 1);
                }
            }
            Decoder.rmv = rmv;
            function decode(route, len, buff) {
                var protos = getProto(_routeProtos, route);
                if (!protos) {
                    console.error("error: route=" + route + "  protos not exist");
                    return;
                }
                return decodeMsg(buff, len, protos);
            }
            Decoder.decode = decode;
            function decodeMsg(buff, len, protos) {
                var msg = {};
                while (buff.position < len) {
                    var head = Coder.readUInt32(buff);
                    var tag = head >>> 3;
                    var proto = protos[tag];
                    if (!proto) {
                        // let protoStr = JSON.stringify( protos );
                        // console.error( `error: decodeMsg tag=${tag} not exist  protos=${protoStr}`);
                        skipType(buff, len, head & 7);
                        continue;
                    }
                    var protoTp = proto[1 /* type */];
                    var protoKey = proto[0 /* name */];
                    if (proto[3 /* isArr */]) {
                        //arr length
                        var arr = msg[protoKey];
                        if (!arr) {
                            arr = [];
                            msg[protoKey] = arr;
                        }
                        decodeArr(buff, protoTp, /*head&7*/ 0, arr);
                    }
                    else {
                        msg[protoKey] = decodeProp(buff, protoTp);
                    }
                }
                if (buff.position > len) {
                    buff.position = len;
                }
                return msg;
            }
            function skipType(buff, validLen, wireType) {
                var len = 0;
                switch (wireType) {
                    case 0:
                        break;
                    case 1:
                        len = 8;
                        break;
                    case 2:
                        len = Coder.readUInt32(buff);
                        break;
                    case 3:
                        do {
                            if ((wireType = Coder.readUInt32(buff) & 7) === 4)
                                break;
                            skipType(buff, validLen, wireType);
                        } while (true);
                        len = -1;
                        break;
                    case 5:
                        len = 4;
                        break;
                    default:
                        throw Error("invalid wire type " + wireType + " at offset " + buff.position);
                }
                if (len > 0) {
                    var tmpPos = buff.position + len;
                    if (tmpPos > validLen)
                        tmpPos = validLen;
                    buff.position = tmpPos;
                }
                else if (len == 0) {
                    while (buff.position < validLen) {
                        if (buff.readUnsignedByte() < 128)
                            break;
                    }
                }
            }
            ;
            function decodeProp(buff, tp) {
                var strLen;
                switch (tp) {
                    case 0 /* uint32 */:
                        return Coder.readUInt32(buff);
                    case 1 /* int32 */:
                        return Coder.readInt32(buff);
                    case 2 /* bool */:
                        return Coder.readBool(buff);
                    case 3 /* int64 */:
                        return Coder.readInt64(buff);
                    case 5 /* string */:
                        strLen = Coder.readUInt32(buff);
                        return utf8.read(buff, strLen);
                    case 6 /* bytes */:
                        strLen = Coder.readUInt32(buff);
                        var subBuff = new egret.ByteArray();
                        subBuff.endian = egret.Endian.LITTLE_ENDIAN;
                        buff.readBytes(subBuff, 0, strLen);
                        return subBuff;
                    default:
                        var tyProtos = getProto(_tpProtos, tp);
                        var msgLen = Coder.readUInt32(buff);
                        return decodeMsg(buff, buff.position + msgLen, tyProtos);
                }
            }
            function decodeArr(buff, tp, wireTp, ret) {
                var i = 0, tmpVal;
                if (tp < 10 /* msgstart */) {
                    //if( wireTp!=2 ){
                    ret.push(decodeProp(buff, tp));
                    // }
                    // else{
                    //     let arrLen = Coder.readUInt32( buff );
                    //     switch ( tp ) {
                    //         case ProtoType.uint32:
                    //         case ProtoType.int32:
                    //             for( ;i<arrLen;++i){
                    //                 tmpVal = Coder.readUInt32( buff );
                    //                 ret.push( tmpVal );
                    //             }
                    //             break;
                    //         case ProtoType.int64:
                    //             break;
                    //         case ProtoType.bool:
                    //             for( ;i<arrLen;++i){
                    //                 tmpVal = !!buff.readUnsignedByte();
                    //                 ret.push( tmpVal );
                    //             }
                    //             break;
                    //         case ProtoType.string:
                    //             for( ; i<arrLen; ++i ){
                    //                 let strLen = Coder.readUInt32( buff );
                    //                 tmpVal = utf8.read( buff, strLen );
                    //                 ret.push( tmpVal );
                    //             }
                    //             break;
                    //         }
                    // }
                }
                else {
                    var tyProtos = getProto(_tpProtos, tp);
                    var msgLen = Coder.readUInt32(buff);
                    tmpVal = decodeMsg(buff, buff.position + msgLen, tyProtos);
                    ret.push(tmpVal);
                }
            }
            // function getHead( buff:egret.ByteArray ):number[] {
            //     let tag = Coder.readVarint32( buff );
            //     return [tag & 0x7,tag >> 3];
            // }
        })(Decoder || (Decoder = {}));
    })(Protobuf = game.Protobuf || (game.Protobuf = {}));
    var Coder;
    (function (Coder) {
        function readUInt32(buf) {
            return readVarint32(buf);
        }
        Coder.readUInt32 = readUInt32;
        ;
        function readInt32(buf) {
            return readVarint32(buf) | 0;
        }
        Coder.readInt32 = readInt32;
        ;
        function readBool(buf) {
            return !!buf.readUnsignedByte();
        }
        Coder.readBool = readBool;
        ;
        function readInt64(buf) {
            var bits = readLongVarint(buf);
            return longBits2Num(bits, false);
        }
        Coder.readInt64 = readInt64;
        ;
        function writeUInt32(buf, val) {
            writeVarint32(buf, val);
        }
        Coder.writeUInt32 = writeUInt32;
        function writeInt32(buf, val) {
            if (val < 0) {
                var longBit = num2LongBits(val);
                writeVarint64(buf, longBit);
            }
            else {
                writeVarint32(buf, val);
            }
        }
        Coder.writeInt32 = writeInt32;
        function writeInt64(buf, val) {
            var longBit = num2LongBits(val);
            writeVarint64(buf, longBit);
        }
        Coder.writeInt64 = writeInt64;
        function writeBool(buf, val) {
            buf.writeByte(val ? 1 : 0);
        }
        Coder.writeBool = writeBool;
        ;
        function writeVarint32(buf, val) {
            while (val > 127) {
                buf.writeByte(val & 127 | 128);
                val >>>= 7;
            }
            buf.writeByte(val);
        }
        function writeVarint64(buf, longBit) {
            while (longBit.hi) {
                buf.writeByte(longBit.lo & 127 | 128);
                longBit.lo = (longBit.lo >>> 7 | longBit.hi << 25) >>> 0;
                longBit.hi >>>= 7;
            }
            while (longBit.lo > 127) {
                buf.writeByte(longBit.lo & 127 | 128);
                longBit.lo = longBit.lo >>> 7;
            }
            buf.writeByte(longBit.lo);
        }
        function readVarint32(buf) {
            // let n = 0, m=0, bit=0;
            // while( 1 ){
            //     m = buf.readUnsignedByte();
            //     n = n + ((m&127)<<bit);
            //     if (m < 128) break;
            //     bit += 7;
            // }
            var tmp = buf.readUnsignedByte();
            var value = tmp & 127;
            if (tmp < 128)
                return value;
            tmp = buf.readUnsignedByte();
            value = (value | (tmp & 127) << 7) >>> 0;
            if (tmp < 128)
                return value;
            tmp = buf.readUnsignedByte();
            value = (value | (tmp & 127) << 14) >>> 0;
            if (tmp < 128)
                return value;
            tmp = buf.readUnsignedByte();
            value = (value | (tmp & 127) << 21) >>> 0;
            if (tmp < 128)
                return value;
            tmp = buf.readUnsignedByte();
            value = (value | (tmp & 15) << 28) >>> 0;
            if (tmp < 128)
                return value;
            buf.position += 5;
            return value;
        }
        function readLongVarint(buf) {
            // tends to deopt with local vars for octet etc.
            var bits = { lo: 0, hi: 0 };
            var i = 0, tmp = 0;
            if (buf.length - buf.position > 4) {
                for (; i < 4; ++i) {
                    // 1st..4th
                    tmp = buf.readUnsignedByte();
                    bits.lo = (bits.lo | (tmp & 127) << i * 7) >>> 0;
                    if (tmp < 128)
                        return bits;
                }
                // 5th
                tmp = buf.readUnsignedByte();
                bits.lo = (bits.lo | (tmp & 127) << 28) >>> 0;
                bits.hi = (bits.hi | (tmp & 127) >> 4) >>> 0;
                if (tmp < 128)
                    return bits;
                i = 0;
            }
            else {
                for (; i < 3; ++i) {
                    // 1st..3th
                    tmp = buf.readUnsignedByte();
                    bits.lo = (bits.lo | (tmp & 127) << i * 7) >>> 0;
                    if (tmp < 128)
                        return bits;
                }
                // 4th
                tmp = buf.readUnsignedByte();
                bits.lo = (bits.lo | (tmp & 127) << i * 7) >>> 0;
                return bits;
            }
            if (buf.length - buf.position > 4) {
                for (; i < 5; ++i) {
                    // 6th..10th
                    tmp = buf.readUnsignedByte();
                    bits.hi = (bits.hi | (tmp & 127) << i * 7 + 3) >>> 0;
                    if (tmp < 128)
                        return bits;
                }
            }
            else {
                for (; i < 5; ++i) {
                    // 6th..10th
                    tmp = buf.readUnsignedByte();
                    bits.hi = (bits.hi | (tmp & 127) << i * 7 + 3) >>> 0;
                    if (tmp < 128)
                        return bits;
                }
            }
            /* istanbul ignore next */
            throw Error("invalid varint encoding");
        }
        function longBits2Num(val, isUnsigned) {
            if (!isUnsigned && val.hi >>> 31) {
                var lo = ~val.lo + 1 >>> 0, hi = ~val.hi >>> 0;
                if (!lo)
                    hi = hi + 1 >>> 0;
                return -(lo + hi * 4294967296);
            }
            return val.lo + val.hi * 4294967296;
        }
        ;
        function num2LongBits(value) {
            if (value === 0)
                return { hi: 0, lo: 0 };
            var sign = value < 0;
            if (sign)
                value = -value;
            var lo = value >>> 0, hi = (value - lo) / 4294967296 >>> 0;
            if (sign) {
                hi = ~hi >>> 0;
                lo = ~lo >>> 0;
                if (++lo > 4294967295) {
                    lo = 0;
                    if (++hi > 4294967295)
                        hi = 0;
                }
            }
            return { hi: hi, lo: lo };
        }
        ;
    })(Coder || (Coder = {}));
    var utf8;
    (function (utf8) {
        /**
         * Calculates the UTF8 byte length of a string.
         * @param {string} str String
         * @returns {number} Byte length
         */
        function length(str) {
            var len = 0, c = 0;
            for (var i = 0, strLen = str.length; i < strLen; ++i) {
                c = str.charCodeAt(i);
                if (c < 128)
                    len += 1;
                else if (c < 2048)
                    len += 2;
                else if ((c & 0xFC00) === 0xD800 && (str.charCodeAt(i + 1) & 0xFC00) === 0xDC00) {
                    ++i;
                    len += 4;
                }
                else
                    len += 3;
            }
            return len;
        }
        utf8.length = length;
        ;
        /**
         * Reads UTF8 bytes as a string.
         * @param {egret.ByteArray} buffer Source buffer
         * @param {number} len Source len
         * @returns {string} String read
         */
        function read(buff, len) {
            if (len < 1)
                return "";
            var end = buff.position + len;
            var i = 0, t = 0;
            var chunk = [];
            var parts = null;
            while (buff.position < end) {
                t = buff.readUnsignedByte();
                if (t < 128)
                    chunk[i++] = t;
                else if (t > 191 && t < 224)
                    chunk[i++] = (t & 31) << 6 | buff.readUnsignedByte() & 63;
                else if (t > 239 && t < 365) {
                    t = ((t & 7) << 18 | (buff.readUnsignedByte() & 63) << 12 | (buff.readUnsignedByte() & 63) << 6 | buff.readUnsignedByte() & 63) - 0x10000;
                    chunk[i++] = 0xD800 + (t >> 10);
                    chunk[i++] = 0xDC00 + (t & 1023);
                }
                else
                    chunk[i++] = (t & 15) << 12 | (buff.readUnsignedByte() & 63) << 6 | buff.readUnsignedByte() & 63;
                if (i > 8191) {
                    (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
                    i = 0;
                }
            }
            if (parts) {
                if (i)
                    parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
                return parts.join("");
            }
            return String.fromCharCode.apply(String, chunk.slice(0, i));
        }
        utf8.read = read;
        ;
        /**
         * Writes a string as UTF8 bytes.
         * @param {string} string Source string
         * @param {egret.ByteArray} buffer Destination buffer
         * @returns {number} Bytes written
         */
        function write(str, buff) {
            var start = buff.position;
            var c1 = 0, c2 = 0; // character 1  character 2
            for (var i = 0, len = str.length; i < len; ++i) {
                c1 = str.charCodeAt(i);
                if (c1 < 128) {
                    buff.writeByte(c1);
                }
                else if (c1 < 2048) {
                    buff.writeByte(c1 >> 6 | 192);
                    buff.writeByte(c1 & 63 | 128);
                }
                else if ((c1 & 0xFC00) === 0xD800 && ((c2 = str.charCodeAt(i + 1)) & 0xFC00) === 0xDC00) {
                    c1 = 0x10000 + ((c1 & 0x03FF) << 10) + (c2 & 0x03FF);
                    ++i;
                    buff.writeByte(c1 >> 18 | 240);
                    buff.writeByte(c1 >> 12 & 63 | 128);
                    buff.writeByte(c1 >> 6 & 63 | 128);
                    buff.writeByte(c1 & 63 | 128);
                }
                else {
                    buff.writeByte(c1 >> 12 | 224);
                    buff.writeByte(c1 >> 6 & 63 | 128);
                    buff.writeByte(c1 & 63 | 128);
                }
            }
            return buff.position - start;
        }
        utf8.write = write;
        ;
    })(utf8 || (utf8 = {}));
})(game || (game = {}));
//# sourceMappingURL=Protobuf.js.map