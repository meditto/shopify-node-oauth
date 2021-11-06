import type { AdminScopes, CallbackQueryObject, InstallRequestQueryObject, OAuthOptions, ShopifyOAuthStorage, TokenData } from "../types";
declare type HandleInstallRequestCallbacks = {
    redirectToShopifyInstall(url: string): Promise<void>;
    onInstalled(tokenData: TokenData): Promise<void>;
    onError(error: Error): Promise<void>;
};
declare type HandleCallbackRequestCallbacks = {
    onOAuthComplete(tokenData: TokenData): Promise<void>;
    onError(error: Error): Promise<void>;
};
export default class ShopifyOAuth {
    private oAuthHandler;
    constructor(options: OAuthOptions, storage?: ShopifyOAuthStorage);
    handleInstallRequest({ query, scopes, handlers, }: {
        query: InstallRequestQueryObject;
        scopes: AdminScopes[];
        handlers: HandleInstallRequestCallbacks;
    }): Promise<void>;
    handleCallbackRequest({ query, handlers, }: {
        query: CallbackQueryObject;
        handlers: HandleCallbackRequestCallbacks;
    }): Promise<void>;
    getAccessToken(shop: string): Promise<string>;
}
export {};
