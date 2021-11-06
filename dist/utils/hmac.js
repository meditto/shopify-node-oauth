"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
class HmacValidator {
    constructor(secret) {
        this.secret = secret;
        this.hmac = crypto_1.default.createHmac("sha256", this.secret);
    }
    hash(message, encoding = "hex") {
        this.hmac.update(message);
        return this.hmac.digest(encoding);
    }
    verify(hash, message, encoding = "hex") {
        this.hmac.update(message);
        return hash == this.hmac.digest(encoding);
    }
}
exports.default = HmacValidator;
