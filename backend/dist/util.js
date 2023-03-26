"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionFromServer = exports.RoomCodeManager = void 0;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
// Generate random unique room codes
// Only repeats codes if all codes within a range are used up
// which is unlikely
class RoomCodeManager {
    // Generate 4-letter codes by default
    constructor(codeLength = 4) {
        this.codeLength = codeLength;
        this.usedCodes = new Set();
    }
    generateCode() {
        const min = 0;
        const max = Math.pow(ALPHABET.length, this.codeLength);
        let code = randInt(min, max);
        // If every code is already in use, just return a random code
        // (collisions are inevitable)
        if (this.usedCodes.size >= max) {
            return this.encodeAlphabet(code);
        }
        // Keep incrementing by 1 until an unused code is found
        while (this.usedCodes.has(this.encodeAlphabet(code))) {
            code = (code + 1) % max;
        }
        this.usedCodes.add(this.encodeAlphabet(code));
        return this.encodeAlphabet(code);
    }
    encodeAlphabet(num) {
        let str = "";
        const len = ALPHABET.length;
        while (num > 0) {
            let radix = num % len;
            str = ALPHABET[radix] + str;
            num = Math.floor(num / len);
        }
        return str.padStart(this.codeLength, ALPHABET[0]);
    }
    releaseCode(code) {
        this.usedCodes.delete(code);
    }
}
exports.RoomCodeManager = RoomCodeManager;
function actionFromServer(action) {
    return Object.assign(Object.assign({}, action), { meta: Object.assign(Object.assign({}, action === null || action === void 0 ? void 0 : action.meta), { server: true }) });
}
exports.actionFromServer = actionFromServer;
