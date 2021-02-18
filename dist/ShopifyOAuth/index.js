"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ShopifyOAuthHandler_1 = __importDefault(require("./ShopifyOAuthHandler"));
class ShopifyOAuth {
    constructor(options, storage) {
        this.oAuthHandler = new ShopifyOAuthHandler_1.default(options, storage);
    }
    async handleInstallRequest({ query, scopes, handlers, }) {
        try {
            const tokenData = await this.oAuthHandler.getTokenData(query.shop);
            if (tokenData && tokenData.access_token && tokenData.scope) {
                await handlers.onInstalled(tokenData);
            }
            else {
                const url = await this.oAuthHandler.getRedirectURL({
                    ...query,
                    scopes,
                });
                await handlers.redirectToShopifyInstall(url);
            }
        }
        catch (e) {
            handlers.onError(e);
        }
    }
    async handleCallbackRequest({ query, handlers, }) {
        try {
            const tokenData = await this.oAuthHandler.getAccessToken(query);
            await handlers.onOAuthComplete(tokenData);
        }
        catch (e) {
            handlers.onError(e);
        }
    }
}
exports.default = ShopifyOAuth;
//# sourceMappingURL=index.js.map