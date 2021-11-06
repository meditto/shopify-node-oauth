import type {
  AdminScopes,
  CallbackQueryObject,
  InstallRequestQueryObject,
  OAuthOptions,
  ShopifyOAuthStorage,
  TokenData,
} from "../types";
import ShopifyOAuthHandler from "./ShopifyOAuthHandler";

type HandleInstallRequestCallbacks = {
  redirectToShopifyInstall(url: string): Promise<void>;
  onInstalled(tokenData: TokenData): Promise<void>;
  onError(error: Error): Promise<void>;
};

type HandleCallbackRequestCallbacks = {
  onOAuthComplete(tokenData: TokenData): Promise<void>;
  onError(error: Error): Promise<void>;
};

export default class ShopifyOAuth {
  private oAuthHandler: ShopifyOAuthHandler;

  constructor(options: OAuthOptions, storage?: ShopifyOAuthStorage) {
    this.oAuthHandler = new ShopifyOAuthHandler(options, storage);
  }

  async handleInstallRequest({
    query,
    scopes,
    handlers,
  }: {
    query: InstallRequestQueryObject;
    scopes: AdminScopes[];
    handlers: HandleInstallRequestCallbacks;
  }): Promise<void> {
    try {
      const tokenData = await this.oAuthHandler.getTokenData(query.shop);
      if (tokenData && tokenData.access_token && tokenData.scope) {
        await handlers.onInstalled(tokenData);
      } else {
        const url = await this.oAuthHandler.getRedirectURL({
          query,
          scopes,
        });
        await handlers.redirectToShopifyInstall(url);
      }
    } catch (e) {
      handlers.onError(e);
    }
  }

  async handleCallbackRequest({
    query,
    handlers,
  }: {
    query: CallbackQueryObject;
    handlers: HandleCallbackRequestCallbacks;
  }): Promise<void> {
    try {
      const tokenData = await this.oAuthHandler.getAccessTokenFromShopify(
        query
      );
      await handlers.onOAuthComplete(tokenData);
    } catch (e) {
      handlers.onError(e);
    }
  }

  async getAccessToken(shop: string): Promise<string> {
    return (await this.oAuthHandler.getTokenData(shop)).access_token;
  }
}
