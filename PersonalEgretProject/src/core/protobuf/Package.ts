// module game {
//     export module Package {
//         export function encode(msgId: number, len: number, buf: egret.ByteArray) {
//             buf.writeInt(msgId);
//             buf.writeShort(len);
//         }

//         export function decode(data: egret.ByteArray): { id: number, len: number } {
//             let msgId = data.readInt();
//             let msgLen = data.readShort();
//             return { id: msgId, len: msgLen };
//         }
//     }
// }