"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = __importDefault(require("https"));
async function makePostRequest(url, bodyString) {
    return new Promise((resolve, reject) => {
        const req = https_1.default.request(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": bodyString.length,
            },
        }, (res) => {
            let data = "";
            res.on("data", (d) => {
                data += d.toString();
            });
            res.on("error", reject);
            res.on("end", () => {
                resolve(JSON.parse(data));
            });
        });
        req.on("error", reject);
        req.write(bodyString);
        req.end();
    });
}
exports.default = makePostRequest;
