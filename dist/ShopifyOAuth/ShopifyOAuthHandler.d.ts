import type { AdminScopes, CallbackQueryObject, InstallRequestQueryObject, OAuthOptions, ShopifyOAuthStorage, TokenData } from "../types";
export default class ShopifyOAuthHandler {
    private options;
    private oAuthStorage;
    private hmacValidator;
    constructor(options: OAuthOptions, oAuthStorage?: ShopifyOAuthStorage);
    stringifyQuery(query: any): string;
    getRedirectURL({ query, scopes, }: {
        query: InstallRequestQueryObject;
        scopes: AdminScopes[];
    }): Promise<string>;
    getAccessTokenFromShopify(query: CallbackQueryObject): Promise<TokenData>;
    private saveTokenData;
    getTokenData(shop: string): Promise<TokenData>;
    private saveNonce;
    private getNonce;
    private requestAccessToken;
    private makeRedirectURL;
    private generateNonce;
    private verifyHmac;
    private verifyState;
    private verifyHostname;
    private isValidHostname;
    private isHmacValid;
}
