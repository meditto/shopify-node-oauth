/// <reference types="node" />
import crypto from "crypto";
export default class HmacValidator {
    private secret;
    private hmac;
    constructor(secret: string);
    hash(message: string, encoding?: crypto.BinaryToTextEncoding): string;
    verify(hash: string, message: string, encoding?: crypto.BinaryToTextEncoding): boolean;
}
//# sourceMappingURL=hmac.d.ts.map