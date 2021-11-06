"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const storage = {};
const InMemoryOAuthStorage = {
    async get(key) {
        return storage[key];
    },
    async set(key, value) {
        storage[key] = value;
    },
};
class ShopifyOAuthHandler {
    constructor(options, oAuthStorage = InMemoryOAuthStorage) {
        this.options = options;
        this.oAuthStorage = oAuthStorage;
    }
    stringifyQuery(query) {
        const orderedObj = Object.keys(query)
            .sort((val1, val2) => val1.localeCompare(val2))
            .reduce((obj, key) => {
            obj[key] = query[key];
            return obj;
        }, {});
        return Object.keys(orderedObj)
            .map(key => `${key}=${orderedObj[key]}`)
            .join('&');
    }
    async getRedirectURL({ query, scopes, }) {
        const { shop } = query;
        const { hmac, ...restParams } = query;
        this.verifyHmac(hmac, this.stringifyQuery(restParams));
        return this.makeRedirectURL(shop, scopes, await this.generateNonce(shop));
    }
    async getAccessTokenFromShopify(query) {
        this.verifyHmac(query.hmac, `code=${query.code}&shop=${query.shop}&state=${query.state}&timestamp=${query.timestamp}`);
        this.verifyHostname(query.shop);
        await this.verifyState(query.shop, query.state);
        const tokenData = await this.requestAccessToken(query);
        await this.saveTokenData(query.shop, tokenData);
        return tokenData;
    }
    async saveTokenData(shop, tokenData) {
        return this.oAuthStorage.set(`token-${shop}`, tokenData);
    }
    async getTokenData(shop) {
        return this.oAuthStorage.get(`token-${shop}`);
    }
    async saveNonce(shop, nonce) {
        return this.oAuthStorage.set(`nonce-${shop}`, nonce);
    }
    async getNonce(shop) {
        return this.oAuthStorage.get(`nonce-${shop}`);
    }
    async requestAccessToken(query) {
        return utils_1.makePostRequest(`https://${query.shop}/admin/oauth/access_token`, JSON.stringify({
            client_id: this.options.apiKey,
            client_secret: this.options.apiSecret,
            code: query.code,
        }));
    }
    makeRedirectURL(shop, scopes, nonce) {
        return `https://${shop}/admin/oauth/authorize?client_id=${this.options.apiKey}&scope=${scopes.join(",")}&redirect_uri=${this.options.clientCallbackURL}&state=${nonce}`;
    }
    async generateNonce(shop) {
        const nonce = `${Math.random()}`;
        await this.saveNonce(shop, nonce);
        return nonce;
    }
    verifyHmac(hmac, message) {
        this.hmacValidator = new utils_1.HmacValidator(this.options.apiSecret);
        if (!this.isHmacValid(hmac, message))
            throw new Error("HMAC verification failed!");
    }
    async verifyState(shop, nonce) {
        if (nonce != (await this.getNonce(shop)))
            throw new Error("Invalid nonce!");
    }
    verifyHostname(hostname) {
        if (!this.isValidHostname(hostname))
            throw new Error("Invalid hostname");
    }
    isValidHostname(hostname) {
        return (/(https|http):\/\/[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com\//g.test(hostname) || /[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com/g.test(hostname));
    }
    isHmacValid(hmac, message) {
        return this.hmacValidator.verify(hmac, message);
    }
}
exports.default = ShopifyOAuthHandler;
