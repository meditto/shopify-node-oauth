import crypto from "crypto";

export default class HmacValidator {
  private hmac: crypto.Hmac;

  constructor(private secret: string) {
    this.hmac = crypto.createHmac("sha256", this.secret);
  }

  hash(message: string, encoding: crypto.BinaryToTextEncoding = "hex"): string {
    this.hmac.update(message);
    return this.hmac.digest(encoding);
  }

  verify(
    hash: string,
    message: string,
    encoding: crypto.BinaryToTextEncoding = "hex"
  ): boolean {
    this.hmac.update(message);
    return hash == this.hmac.digest(encoding);
  }
}
