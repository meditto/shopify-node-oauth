import type {
  AdminScopes,
  CallbackQueryObject,
  InstallRequestQueryObject,
  OAuthOptions,
  ShopifyOAuthStorage,
  TokenData,
} from "../types";
import { HmacValidator, makePostRequest } from "../utils";

import querystring from 'querystring';

const storage: Record<string, unknown> = {};

const InMemoryOAuthStorage: ShopifyOAuthStorage = {
  async get<V>(key: string) {
    return storage[key] as V;
  },
  async set<V>(key: string, value: V) {
    storage[key] = value;
  },
};

export default class ShopifyOAuthHandler {
  private hmacValidator!: HmacValidator;

  constructor(
    private options: OAuthOptions,
    private oAuthStorage: ShopifyOAuthStorage = InMemoryOAuthStorage
  ) {}

  stringifyQuery(query: InstallRequestQueryObject): string {
    const orderedObj = Object.keys(query)
      .sort((val1, val2) => val1.localeCompare(val2))
      .reduce((obj: Record<string, string | undefined>, key: keyof AuthQuery) => {
        obj[key] = query[key];
        return obj;
      }, {});
    return querystring.stringify(orderedObj);
  }

  async getRedirectURL({
    query,
    scopes,
  }: {query: InstallRequestQueryObject, scopes: AdminScopes[] }): Promise<string> {
    const {shop} = query
    const {hmac,...restParams} = query
    this.verifyHmac(hmac, this.stringifyQuery(restParams));

    return this.makeRedirectURL(shop, scopes, await this.generateNonce(shop));
  }

  async getAccessTokenFromShopify(
    query: CallbackQueryObject
  ): Promise<TokenData> {
    this.verifyHmac(
      query.hmac,
      `code=${query.code}&shop=${query.shop}&state=${query.state}&timestamp=${query.timestamp}`
    );
    this.verifyHostname(query.shop);

    await this.verifyState(query.shop, query.state);

    const tokenData = await this.requestAccessToken(query);

    await this.saveTokenData(query.shop, tokenData);

    return tokenData;
  }

  private async saveTokenData(shop: string, tokenData: TokenData) {
    return this.oAuthStorage.set(`token-${shop}`, tokenData);
  }

  async getTokenData(shop: string): Promise<TokenData> {
    return this.oAuthStorage.get(`token-${shop}`);
  }

  private async saveNonce(shop: string, nonce: string) {
    return this.oAuthStorage.set(`nonce-${shop}`, nonce);
  }

  private async getNonce(shop: string): Promise<string> {
    return this.oAuthStorage.get(`nonce-${shop}`);
  }

  private async requestAccessToken(
    query: CallbackQueryObject
  ): Promise<TokenData> {
    return makePostRequest<{
      access_token: string;
      scope: string;
    }>(
      `https://${query.shop}/admin/oauth/access_token`,
      JSON.stringify({
        client_id: this.options.apiKey,
        client_secret: this.options.apiSecret,
        code: query.code,
      })
    );
  }

  private makeRedirectURL(
    shop: string,
    scopes: AdminScopes[],
    nonce: string
  ): string {
    return `https://${shop}/admin/oauth/authorize?client_id=${
      this.options.apiKey
    }&scope=${scopes.join(",")}&redirect_uri=${
      this.options.clientCallbackURL
    }&state=${nonce}`;
  }

  private async generateNonce(shop: string) {
    const nonce = `${Math.random()}`;
    await this.saveNonce(shop, nonce);
    return nonce;
  }

  private verifyHmac(hmac: string, message: string) {
    this.hmacValidator = new HmacValidator(this.options.apiSecret);

    if (!this.isHmacValid(hmac, message))
      throw new Error("HMAC verification failed!");
  }

  private async verifyState(shop: string, nonce: string) {
    if (nonce != (await this.getNonce(shop))) throw new Error("Invalid nonce!");
  }

  private verifyHostname(hostname: string) {
    if (!this.isValidHostname(hostname)) throw new Error("Invalid hostname");
  }

  private isValidHostname(hostname: string) {
    return (
      /(https|http):\/\/[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com\//g.test(
        hostname
      ) || /[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com/g.test(hostname)
    );
  }

  private isHmacValid(hmac: string, message: string): boolean {
    return this.hmacValidator.verify(hmac, message);
  }
}
