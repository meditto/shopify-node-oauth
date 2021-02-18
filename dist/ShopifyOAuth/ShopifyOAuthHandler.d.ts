export default class ShopifyOAuthHandler {
    private options;
    private oAuthStorage;
    private hmacValidator;
    constructor(options: OAuthOptions, oAuthStorage?: ShopifyOAuthStorage);
    getRedirectURL({ hmac, shop, timestamp, scopes, }: InstallRequestQueryObject & {
        scopes: Scopes;
    }): Promise<string>;
    getAccessToken(query: CallbackQueryObject): Promise<TokenData>;
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
//# sourceMappingURL=ShopifyOAuthHandler.d.ts.map