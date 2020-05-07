// module game {
//     export module Protobuf {
//         const enum ProtoType {
//             uint32 = 0,
//             int32 = 1,
//             bool = 2,
//             int64 = 3,
//             string = 5,
//             bytes = 6,
//             msgstart = 10,
//         }

//         const enum ProtoInfo_Decode {
//             name,
//             type,
//             isOption,
//             isArr,
//             default
//         }

//         const enum ProtoInfo_Encode {
//             tag,
//             type,
//             isOption,
//             isArr,
//             default
//         }

//         export type ProtoInfos = { [key: string]: any[] };

//         export type ProtosList = { [key: number]: ProtoInfos };

//         export function addEncodeProtos(routeProtos: ProtosList, typeProtos?: ProtosList) {
//             Encoder.add(routeProtos, typeProtos);
//         }

//         export function rmvEncodeProtos(routeProtos: ProtosList, typeProtos?: ProtosList) {
//             Encoder.rmv(routeProtos, typeProtos);
//         }

//         export function addDecodeProtos(routeProtos: ProtosList, typeProtos?: ProtosList) {
//             Decoder.add(routeProtos, typeProtos);
//         }

//         export function rmvDecodeProtos(routeProtos: ProtosList, typeProtos?: ProtosList) {
//             Decoder.rmv(routeProtos, typeProtos);
//         }

//         export function encode(msgId: number, data: any, buff: egret.ByteArray) {
//             return Encoder.encode(msgId, data, buff);
//         }

//         export function decode(msgId: number, len: number, data: egret.ByteArray) {
//             return Decoder.decode(msgId, len, data);
//         }


//         function getProto(protoList: ProtosList[], id: number): ProtoInfos {
//             for (let i = protoList.length - 1; i >= 0; i--) {
//                 let tyProtos = protoList[i][id];
//                 if (tyProtos) return tyProtos;
//             }
//             return null;
//         }
//         //--------------------------------------------------------
//         module Encoder {
//             let _routeProtos: ProtosList[] = [];
//             let _tpProtos: ProtosList[] = [];
//             let _tmpProtos: ProtosList = {};

//             export function add(routeProtos: ProtosList, typeProtos?: ProtosList) {
//                 _routeProtos.push(routeProtos);
//                 if (typeProtos) {
//                     if (DEBUG && _tpProtos.length > 0) {
//                         for (let key in typeProtos) {
//                             if (parseInt(key) < 30) {
//                                 egret.error("协议错误：请检查协议批处理(.bat)文件中的 游戏ID 是否设置");
//                             }
//                             break;
//                         }
//                     }
//                     _tpProtos.push(typeProtos);
//                 }
//             }

//             export function rmv(routeProtos: ProtosList, typeProtos?: ProtosList) {
//                 let idx = _routeProtos.indexOf(routeProtos);
//                 if (idx >= 0) _routeProtos.splice(idx, 1);

//                 if (typeProtos) {
//                     idx = _tpProtos.indexOf(typeProtos);
//                     if (idx >= 0) {
//                         _tpProtos.splice(idx, 1);
//                         _tmpProtos = {};
//                     }
//                 }
//             }

//             export function encode(route: number, msg: { [key: string]: any }, buff: egret.ByteArray) {
//                 // Get protos from protos map use the route as key
//                 let protos: ProtoInfos = getProto(_routeProtos, route);
//                 if (!protos) {
//                     console.error(`error: route=${route}  protos not exist`);
//                     return;
//                 }

//                 encodeMsg(buff, protos, msg);
//                 return buff;
//             }

//             function encodeMsg(buff: egret.ByteArray, protos: ProtoInfos, msg: { [key: string]: any }) {
//                 for (let name in msg) {
//                     let proto = protos[name];
//                     if (proto) {
//                         let protoTp = proto[ProtoInfo_Encode.type];
//                         let tag = makeTag(protoTp, proto[ProtoInfo_Encode.tag]);

//                         let val = msg[name];
//                         if (proto[ProtoInfo_Encode.isArr]) {
//                             encodeArray(buff, protoTp, val, tag);
//                         }
//                         else {
//                             Coder.writeUInt32(buff, tag);
//                             encodeProp(buff, protoTp, val);
//                         }
//                     }
//                 }
//             }

//             function encodeProp(buff: egret.ByteArray, protoTp: ProtoType, value: any) {
//                 switch (protoTp) {
//                     case ProtoType.uint32:
//                         Coder.writeUInt32(buff, value);
//                         break;
//                     case ProtoType.int32:
//                         Coder.writeInt32(buff, value);
//                         break;
//                     case ProtoType.bool:
//                         Coder.writeBool(buff, value);
//                         break;
//                     case ProtoType.int64:
//                         Coder.writeInt64(buff, value);
//                         break;
//                     case ProtoType.string:
//                         let byteLen = utf8.length(value);
//                         Coder.writeUInt32(buff, byteLen);
//                         utf8.write(value, buff);
//                         break;
//                     default:
//                         let tmpProtos = getTpProto(protoTp);
//                         let subBuff = new egret.ByteArray();
//                         encodeMsg(subBuff, tmpProtos, value);
//                         Coder.writeUInt32(buff, subBuff.length);
//                         buff.writeBytes(subBuff);
//                         break;
//                 }
//             }

//             function getTpProto(protoTp: ProtoType) {
//                 let tmpProtos = _tmpProtos[protoTp];
//                 if (!tmpProtos) {
//                     let tpProtos: ProtoInfos = getProto(_tpProtos, protoTp);
//                     tmpProtos = {};
//                     for (let key in tpProtos) {
//                         let protoInfo = tpProtos[key].slice(0);
//                         let protoKey = protoInfo[0];
//                         protoInfo[0] = parseInt(key);
//                         tmpProtos[protoKey] = protoInfo;
//                     }
//                     _tmpProtos[protoTp] = tmpProtos;
//                 }
//                 return tmpProtos;
//             }

//             function encodeArray(buff: egret.ByteArray, protoTp: ProtoType, valArr: any[], tag: number) {
//                 let i = 0, arrLen = valArr.length;
//                 //if( protoTp<ProtoType.msgstart ){
//                 // Coder.writeUInt32(buff, tag);
//                 // Coder.writeUInt32(buff, arrLen );
//                 switch (protoTp) {
//                     case ProtoType.uint32:
//                         for (; i < arrLen; ++i) {
//                             Coder.writeUInt32(buff, tag);
//                             Coder.writeUInt32(buff, valArr[i]);
//                         }
//                         break;
//                     case ProtoType.int32:
//                         for (; i < arrLen; ++i) {
//                             Coder.writeUInt32(buff, tag);
//                             Coder.writeInt32(buff, valArr[i]);
//                         }
//                         break;
//                     case ProtoType.bool:
//                         for (; i < arrLen; ++i) {
//                             Coder.writeUInt32(buff, tag);
//                             Coder.writeBool(buff, valArr[i]);
//                         }
//                         break;
//                     case ProtoType.int64:
//                         for (; i < arrLen; ++i) {
//                             Coder.writeUInt32(buff, tag);
//                             Coder.writeInt64(buff, valArr[i]);
//                         }
//                         break;
//                     case ProtoType.string:
//                         for (; i < arrLen; ++i) {
//                             Coder.writeUInt32(buff, tag);
//                             let str = valArr[i];
//                             let byteLen = utf8.length(str);
//                             Coder.writeUInt32(buff, byteLen);
//                             utf8.write(str, buff);
//                         }
//                         break;
//                     default:
//                         let tmpProtos = getTpProto(protoTp);
//                         for (; i < arrLen; ++i) {
//                             Coder.writeUInt32(buff, tag);
//                             let subBuff = new egret.ByteArray();
//                             encodeMsg(subBuff, tmpProtos, valArr[i]);
//                             Coder.writeUInt32(buff, subBuff.length);
//                             buff.writeBytes(subBuff);
//                         }
//                 }
//                 //}
//                 // else{
//                 //     let tyProtos = _tpProtos[protoTp];
//                 //     for( ; i<arrLen; ++i ){
//                 //         Coder.writeVarint32(buff, tag);
//                 //         encodeMsg(opData, tyProtos, valArr[i]);
//                 //     }
//                 // }
//             }

//             function makeTag(type: ProtoType, tag: number) {
//                 let wireTp = 2;
//                 switch (type) {
//                     case ProtoType.uint32:
//                     case ProtoType.int32:
//                     case ProtoType.bool:
//                     case ProtoType.int64:
//                         wireTp = 0;
//                         break;
//                 }
//                 return (tag << 3) | wireTp;
//             }
//         }


//         //----------------------------------------------------------------
//         module Decoder {
//             let _routeProtos: ProtosList[] = [];
//             let _tpProtos: ProtosList[] = [];

//             export function add(routeProtos: ProtosList, typeProtos?: ProtosList) {
//                 _routeProtos.push(routeProtos);
//                 if (typeProtos) {
//                     if (DEBUG && _tpProtos.length > 0) {
//                         for (let key in typeProtos) {
//                             if (parseInt(key) < 30) {
//                                 egret.error("协议错误：请检查协议批处理(.bat)文件中的 游戏ID 是否设置");
//                             }
//                             break;
//                         }
//                     }
//                     _tpProtos.push(typeProtos);
//                 }
//             }

//             export function rmv(routeProtos: ProtosList, typeProtos?: ProtosList) {
//                 let idx = _routeProtos.indexOf(routeProtos);
//                 if (idx >= 0) _routeProtos.splice(idx, 1);

//                 if (typeProtos) {
//                     idx = _tpProtos.indexOf(typeProtos);
//                     if (idx >= 0) _tpProtos.splice(idx, 1);
//                 }
//             }

//             export function decode(route: number, len: number, buff: egret.ByteArray) {
//                 let protos: ProtoInfos = getProto(_routeProtos, route);
//                 if (!protos) {
//                     console.error(`error: route=${route}  protos not exist`);
//                     return;
//                 }

//                 return decodeMsg(buff, len, protos);
//             }

//             function decodeMsg(buff: egret.ByteArray, len: number, protos: ProtoInfos) {
//                 let msg: any = {};
//                 while (buff.position < len) {
//                     let head = Coder.readUInt32(buff);
//                     let tag = head >>> 3;
//                     let proto = protos[tag];
//                     if (!proto) {
//                         // let protoStr = JSON.stringify( protos );
//                         // console.error( `error: decodeMsg tag=${tag} not exist  protos=${protoStr}`);
//                         skipType(buff, len, head & 7);
//                         continue;
//                     }

//                     let protoTp = proto[ProtoInfo_Decode.type];
//                     let protoKey = proto[ProtoInfo_Decode.name];
//                     if (proto[ProtoInfo_Decode.isArr]) {
//                         //arr length
//                         let arr = msg[protoKey];
//                         if (!arr) {
//                             arr = [];
//                             msg[protoKey] = arr;
//                         }
//                         decodeArr(buff, protoTp, /*head&7*/0, arr);
//                     }
//                     else {
//                         msg[protoKey] = decodeProp(buff, protoTp)
//                     }
//                 }

//                 if (buff.position > len) {
//                     buff.position = len;
//                 }
//                 return msg;
//             }

//             function skipType(buff: egret.ByteArray, validLen: number, wireType: number) {
//                 let len = 0;
//                 switch (wireType) {
//                     case 0:
//                         break;
//                     case 1:
//                         len = 8;
//                         break;
//                     case 2:
//                         len = Coder.readUInt32(buff);
//                         break;
//                     case 3:
//                         do { // eslint-disable-line no-constant-condition
//                             if ((wireType = Coder.readUInt32(buff) & 7) === 4)
//                                 break;
//                             skipType(buff, validLen, wireType);
//                         } while (true);
//                         len = -1;
//                         break;
//                     case 5:
//                         len = 4;
//                         break;
//                     default:
//                         throw Error("invalid wire type " + wireType + " at offset " + buff.position);
//                 }

//                 if (len > 0) {
//                     let tmpPos = buff.position + len;
//                     if (tmpPos > validLen) tmpPos = validLen;
//                     buff.position = tmpPos;
//                 } else if (len == 0) {
//                     while (buff.position < validLen) {
//                         if (buff.readUnsignedByte() < 128) break;
//                     }
//                 }
//             };

//             function decodeProp(buff: egret.ByteArray, tp: ProtoType) {
//                 let strLen: number;
//                 switch (tp) {
//                     case ProtoType.uint32:
//                         return Coder.readUInt32(buff);
//                     case ProtoType.int32:
//                         return Coder.readInt32(buff);
//                     case ProtoType.bool:
//                         return Coder.readBool(buff);
//                     case ProtoType.int64:
//                         return Coder.readInt64(buff);
//                     case ProtoType.string:
//                         strLen = Coder.readUInt32(buff);
//                         return utf8.read(buff, strLen);
//                     case ProtoType.bytes:
//                         strLen = Coder.readUInt32(buff);
//                         let subBuff = new egret.ByteArray();
//                         subBuff.endian = egret.Endian.LITTLE_ENDIAN;
//                         buff.readBytes(subBuff, 0, strLen);
//                         return subBuff;
//                     default:
//                         let tyProtos: ProtoInfos = getProto(_tpProtos, tp);
//                         let msgLen = Coder.readUInt32(buff);
//                         return decodeMsg(buff, buff.position + msgLen, tyProtos);
//                 }
//             }

//             function decodeArr(buff: egret.ByteArray, tp: ProtoType, wireTp: number, ret: any[]) {
//                 let i = 0, tmpVal: any;
//                 if (tp < ProtoType.msgstart) {
//                     //if( wireTp!=2 ){
//                     ret.push(decodeProp(buff, tp));
//                     // }
//                     // else{
//                     //     let arrLen = Coder.readUInt32( buff );
//                     //     switch ( tp ) {
//                     //         case ProtoType.uint32:
//                     //         case ProtoType.int32:
//                     //             for( ;i<arrLen;++i){
//                     //                 tmpVal = Coder.readUInt32( buff );
//                     //                 ret.push( tmpVal );
//                     //             }
//                     //             break;
//                     //         case ProtoType.int64:
//                     //             break;
//                     //         case ProtoType.bool:
//                     //             for( ;i<arrLen;++i){
//                     //                 tmpVal = !!buff.readUnsignedByte();
//                     //                 ret.push( tmpVal );
//                     //             }
//                     //             break;
//                     //         case ProtoType.string:
//                     //             for( ; i<arrLen; ++i ){
//                     //                 let strLen = Coder.readUInt32( buff );
//                     //                 tmpVal = utf8.read( buff, strLen );
//                     //                 ret.push( tmpVal );
//                     //             }
//                     //             break;
//                     //         }
//                     // }
//                 }
//                 else {
//                     let tyProtos = getProto(_tpProtos, tp);
//                     let msgLen = Coder.readUInt32(buff);
//                     tmpVal = decodeMsg(buff, buff.position + msgLen, tyProtos);
//                     ret.push(tmpVal);
//                 }
//             }

//             // function getHead( buff:egret.ByteArray ):number[] {
//             //     let tag = Coder.readVarint32( buff );
//             //     return [tag & 0x7,tag >> 3];
//             // }
//         }
//     }

//     module Coder {
//         export function readUInt32(buf: egret.ByteArray) {
//             return readVarint32(buf);
//         };

//         export function readInt32(buf: egret.ByteArray) {
//             return readVarint32(buf) | 0;
//         };

//         export function readBool(buf: egret.ByteArray) {
//             return !!buf.readUnsignedByte();
//         };

//         export function readInt64(buf: egret.ByteArray) {
//             let bits = readLongVarint(buf);
//             return longBits2Num(bits, false);
//         };

//         export function writeUInt32(buf: egret.ByteArray, val: number) {
//             writeVarint32(buf, val);
//         }

//         export function writeInt32(buf: egret.ByteArray, val: number) {
//             if (val < 0) {
//                 let longBit = num2LongBits(val);
//                 writeVarint64(buf, longBit);
//             }
//             else {
//                 writeVarint32(buf, val);
//             }
//         }

//         export function writeInt64(buf: egret.ByteArray, val: number) {
//             let longBit = num2LongBits(val);
//             writeVarint64(buf, longBit);
//         }

//         export function writeBool(buf: egret.ByteArray, val: boolean) {
//             buf.writeByte(val ? 1 : 0);
//         };

//         function writeVarint32(buf: egret.ByteArray, val: number) {
//             while (val > 127) {
//                 buf.writeByte(val & 127 | 128);
//                 val >>>= 7;
//             }
//             buf.writeByte(val);
//         }

//         function writeVarint64(buf: egret.ByteArray, longBit: { hi: number, lo: number }) {
//             while (longBit.hi) {
//                 buf.writeByte(longBit.lo & 127 | 128);
//                 longBit.lo = (longBit.lo >>> 7 | longBit.hi << 25) >>> 0;
//                 longBit.hi >>>= 7;
//             }
//             while (longBit.lo > 127) {
//                 buf.writeByte(longBit.lo & 127 | 128);
//                 longBit.lo = longBit.lo >>> 7;
//             }
//             buf.writeByte(longBit.lo);
//         }

//         function readVarint32(buf: egret.ByteArray) {
//             // let n = 0, m=0, bit=0;
//             // while( 1 ){
//             //     m = buf.readUnsignedByte();
//             //     n = n + ((m&127)<<bit);
//             //     if (m < 128) break;
//             //     bit += 7;
//             // }
//             let tmp = buf.readUnsignedByte();
//             let value = tmp & 127;
//             if (tmp < 128) return value;

//             tmp = buf.readUnsignedByte();
//             value = (value | (tmp & 127) << 7) >>> 0;
//             if (tmp < 128) return value;

//             tmp = buf.readUnsignedByte();
//             value = (value | (tmp & 127) << 14) >>> 0;
//             if (tmp < 128) return value;

//             tmp = buf.readUnsignedByte();
//             value = (value | (tmp & 127) << 21) >>> 0;
//             if (tmp < 128) return value;

//             tmp = buf.readUnsignedByte();
//             value = (value | (tmp & 15) << 28) >>> 0;
//             if (tmp < 128) return value;

//             buf.position += 5;
//             return value;
//         }

//         function readLongVarint(buf: egret.ByteArray) {
//             // tends to deopt with local vars for octet etc.
//             let bits = { lo: 0, hi: 0 };
//             let i = 0, tmp = 0;
//             if (buf.length - buf.position > 4) { // fast route (lo)
//                 for (; i < 4; ++i) {
//                     // 1st..4th
//                     tmp = buf.readUnsignedByte();
//                     bits.lo = (bits.lo | (tmp & 127) << i * 7) >>> 0;
//                     if (tmp < 128)
//                         return bits;
//                 }
//                 // 5th
//                 tmp = buf.readUnsignedByte();
//                 bits.lo = (bits.lo | (tmp & 127) << 28) >>> 0;
//                 bits.hi = (bits.hi | (tmp & 127) >> 4) >>> 0;
//                 if (tmp < 128)
//                     return bits;
//                 i = 0;
//             } else {
//                 for (; i < 3; ++i) {
//                     // 1st..3th
//                     tmp = buf.readUnsignedByte();
//                     bits.lo = (bits.lo | (tmp & 127) << i * 7) >>> 0;
//                     if (tmp < 128)
//                         return bits;
//                 }
//                 // 4th
//                 tmp = buf.readUnsignedByte();
//                 bits.lo = (bits.lo | (tmp & 127) << i * 7) >>> 0;
//                 return bits;
//             }
//             if (buf.length - buf.position > 4) { // fast route (hi)
//                 for (; i < 5; ++i) {
//                     // 6th..10th
//                     tmp = buf.readUnsignedByte();
//                     bits.hi = (bits.hi | (tmp & 127) << i * 7 + 3) >>> 0;
//                     if (tmp < 128)
//                         return bits;
//                 }
//             } else {
//                 for (; i < 5; ++i) {
//                     // 6th..10th
//                     tmp = buf.readUnsignedByte();
//                     bits.hi = (bits.hi | (tmp & 127) << i * 7 + 3) >>> 0;
//                     if (tmp < 128)
//                         return bits;
//                 }
//             }
//             /* istanbul ignore next */
//             throw Error("invalid varint encoding");
//         }

//         function longBits2Num(val: { hi: number, lo: number }, isUnsigned: boolean) {
//             if (!isUnsigned && val.hi >>> 31) {
//                 var lo = ~val.lo + 1 >>> 0,
//                     hi = ~val.hi >>> 0;
//                 if (!lo)
//                     hi = hi + 1 >>> 0;
//                 return -(lo + hi * 4294967296);
//             }
//             return val.lo + val.hi * 4294967296;
//         };

//         function num2LongBits(value: number): { hi: number, lo: number } {
//             if (value === 0) return { hi: 0, lo: 0 };

//             let sign = value < 0;
//             if (sign) value = -value;

//             let lo = value >>> 0, hi = (value - lo) / 4294967296 >>> 0;

//             if (sign) {
//                 hi = ~hi >>> 0;
//                 lo = ~lo >>> 0;
//                 if (++lo > 4294967295) {
//                     lo = 0;
//                     if (++hi > 4294967295)
//                         hi = 0;
//                 }
//             }
//             return { hi: hi, lo: lo };
//         };
//     }

//     module utf8 {
//         /**
//          * Calculates the UTF8 byte length of a string.
//          * @param {string} str String
//          * @returns {number} Byte length
//          */
//         export function length(str: string) {
//             let len = 0, c = 0;
//             for (let i = 0, strLen = str.length; i < strLen; ++i) {
//                 c = str.charCodeAt(i);
//                 if (c < 128)
//                     len += 1;
//                 else if (c < 2048)
//                     len += 2;
//                 else if ((c & 0xFC00) === 0xD800 && (str.charCodeAt(i + 1) & 0xFC00) === 0xDC00) {
//                     ++i;
//                     len += 4;
//                 } else
//                     len += 3;
//             }
//             return len;
//         };

//         /**
//          * Reads UTF8 bytes as a string.
//          * @param {egret.ByteArray} buffer Source buffer
//          * @param {number} len Source len
//          * @returns {string} String read
//          */
//         export function read(buff: egret.ByteArray, len: number) {
//             if (len < 1) return "";

//             let end = buff.position + len;
//             let i = 0, t = 0;
//             let chunk = [];
//             let parts = null;

//             while (buff.position < end) {
//                 t = buff.readUnsignedByte();
//                 if (t < 128)
//                     chunk[i++] = t;
//                 else if (t > 191 && t < 224)
//                     chunk[i++] = (t & 31) << 6 | buff.readUnsignedByte() & 63;
//                 else if (t > 239 && t < 365) {
//                     t = ((t & 7) << 18 | (buff.readUnsignedByte() & 63) << 12 | (buff.readUnsignedByte() & 63) << 6 | buff.readUnsignedByte() & 63) - 0x10000;
//                     chunk[i++] = 0xD800 + (t >> 10);
//                     chunk[i++] = 0xDC00 + (t & 1023);
//                 } else
//                     chunk[i++] = (t & 15) << 12 | (buff.readUnsignedByte() & 63) << 6 | buff.readUnsignedByte() & 63;
//                 if (i > 8191) {
//                     (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
//                     i = 0;
//                 }
//             }
//             if (parts) {
//                 if (i)
//                     parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
//                 return parts.join("");
//             }
//             return String.fromCharCode.apply(String, chunk.slice(0, i));
//         };

//         /**
//          * Writes a string as UTF8 bytes.
//          * @param {string} string Source string
//          * @param {egret.ByteArray} buffer Destination buffer
//          * @returns {number} Bytes written
//          */
//         export function write(str: string, buff: egret.ByteArray) {
//             let start = buff.position;
//             let c1 = 0, c2 = 0;// character 1  character 2
//             for (let i = 0, len = str.length; i < len; ++i) {
//                 c1 = str.charCodeAt(i);
//                 if (c1 < 128) {
//                     buff.writeByte(c1);
//                 } else if (c1 < 2048) {
//                     buff.writeByte(c1 >> 6 | 192);
//                     buff.writeByte(c1 & 63 | 128);
//                 } else if ((c1 & 0xFC00) === 0xD800 && ((c2 = str.charCodeAt(i + 1)) & 0xFC00) === 0xDC00) {
//                     c1 = 0x10000 + ((c1 & 0x03FF) << 10) + (c2 & 0x03FF);
//                     ++i;
//                     buff.writeByte(c1 >> 18 | 240);
//                     buff.writeByte(c1 >> 12 & 63 | 128);
//                     buff.writeByte(c1 >> 6 & 63 | 128);
//                     buff.writeByte(c1 & 63 | 128);
//                 } else {
//                     buff.writeByte(c1 >> 12 | 224);
//                     buff.writeByte(c1 >> 6 & 63 | 128);
//                     buff.writeByte(c1 & 63 | 128);
//                 }
//             }
//             return buff.position - start;
//         };
//     }
// }


