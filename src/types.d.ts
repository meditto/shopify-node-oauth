declare type OAuthOptions = {
  apiKey: string;
  apiSecret: string;
  clientCallbackURL: string;
};

declare type InstallRequestQueryObject = {
  hmac: string;
  shop: string;
  timestamp: string;
};

declare type Scopes = string[];

declare type CallbackQueryObject = {
  code: string;
  hmac: string;
  timestamp: string;
  state: string;
  shop: string;
};

declare type TokenData = {
  access_token: string;
  scope: string;
};

declare interface ShopifyOAuthStorage {
  set<V = unknown>(key: string, value: V): Promise<void>;
  get<V = unknown>(key: string): Promise<V>;
}
