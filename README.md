## Shopify OAuth Helper Library in Node.js

This is a node helper library for implementing Shopify OAuth Flow in public/custom apps.

### Install

#### Yarn

- yarn add shopify-node-oauth

#### NPM

- npm install shopify-node-oauth

### Usage

#### Step 1 - Instantiate ShopifyOAuth Class

```ts
const shopifyOAuth = new ShopifyOAuth({
  apiKey: process.env.SHOPIFY_API_KEY ?? "", // app api key
  apiSecret: process.env.SHOPIFY_API_SECRET ?? "", // app api secret key
  clientCallbackURL: "https://e3042cae8515.ngrok.io/auth/callback", // redirect uri that you have added in the dashboard
});
```

#### Step 2 - Add a route in the server to handle installation

Express example

```ts
// This endpoint should point to the app url you set in the app dashboard
app.get("/", (req, res) => {
  shopifyOAuth.handleInstallRequest({
    query: req.query, // pass parsed query object from the request URL
    scopes: [
      // Add scope strings as needed, you can use AdminApiScopes exported from this library like so
      AdminApiScopes.read_product_listings,
      AdminApiScopes.write.products, // write access also implies read access
      AdminApiScopes.write.customers,
      AdminApiScopes.write.orders,
    ],
    handlers: {
      // provide a callback to handle the case when you have got the access-token
      async onInstalled() {
        // render you app from here.
        res.send("Welcome to the App!");
      },
      // handle error case
      async onError(e) {
        console.log(e);
        res.status(400).send("Something went wrong! App not installed!");
      },
      // when you don't have access-token yet, redirect to shopify install page
      async redirectToShopifyInstall(
        redirectURL /* redirect url passed by the library*/
      ) {
        res.redirect(redirectURL);
      },
    },
  });
});
```

#### Step 3 - Add a route to handle callback from shopify to get access_token

```ts
// this endpoint should point to the redirection URL that you have set in the app dashboard
app.get("/auth/callback", async (req, res) => {
  shopifyOAuth.handleCallbackRequest({
    query: req.query, // pass the parsed query object
    handlers: {
      // handle error callback
      async onError(e) {
        console.log(e);
        res.status(400).send("Something went wrong! App not installed");
      },
      // handle when oAuth is complete and you get the token data from shopify
      async onOAuthComplete(tokenData) {
        console.log(`Access token received `, tokenData.access_token);

        // you can get the store details using access_token
        const storeName = await getStoreName(tokenData.access_token);

        // you can redirect to app page in the shopify admin's app page
        res.redirect(`https://${req.query.shop}/admin/apps/${storeName}`);
      },
    },
  });
});
```

It's that easy to complete OAuth flow and install your app to any store using this library.

#### Step 4 - Using access-token

```ts
// After the app is installed you can use `shopifyOAuth.getAccessToken` function to get the access_token

const access_token = await shopifyOAuth.getAccessToken(shop);

// use the access_token as needed
```

### Use Persistent Storage

- Note: By default access_tokens data are saved in in-memory object by the library, you can pass your persistent key-value storage handler during instantiation. Like so

```ts
const shopifyOAuth = new ShopifyOAuth(
  {
    apiKey: process.env.SHOPIFY_API_KEY ?? "",
    apiSecret: process.env.SHOPIFY_API_SECRET ?? "",
    clientCallbackURL: "https://e3042cae8515.ngrok.io/auth/callback", // make sure to change this
  },
  // your custom persistent key-value storage handler
  {
    get: redis.get,
    set: redis.set,
  }
);

// The storage handler must follow the following interface

interface ShopifyOAuthStorage {
  set<V>(key: string, value: V): Promise<void>;
  get<V>(key: string): Promise<V>;
}
```

#### Example in Express App

Check out the example [`src/server-example/index`](src/server-example/index.ts).
