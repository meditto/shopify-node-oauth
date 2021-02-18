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

type Modes = "read" | "write";
type Scopes =
  | "content"
  | "themes"
  | "products"
  | "customers"
  | "orders"
  | "draft_orders"
  | "inventory"
  | "script_tags"
  | "fulfillments"
  | "assigned_fulfillment_orders"
  | "merchant_managed_fulfillment_orders"
  | "third_party_fulfillment_orders"
  | "shipping"
  | "users"
  | "checkouts"
  | "reports"
  | "price_rules"
  | "discounts"
  | "marketing_events"
  | "resource_feedbacks"
  | "translations"
  | "locales";

type ReadWriteScopes = `${Modes}_${Scopes}`;

type OnlyReadScopes =
  | "read_product_listings"
  | "read_all_orders"
  | "read_locations"
  | "read_analytics"
  | "read_shopify_payments_payouts"
  | "read_shopify_payments_disputes";

type OnlyWriteScopes = "write_order_edits";

type AdminScopes = ReadWriteScopes | OnlyReadScopes | OnlyWriteScopes;

type AdminApiScopesObject = {
  read: {
    [P in Scopes]: `read_${P}`;
  };
  write: {
    [P in Scopes]: `write_${P}`;
  };
} & {
  [P in OnlyReadScopes]: P;
} &
  {
    [P in OnlyWriteScopes]: P;
  };

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
