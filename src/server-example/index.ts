import dotenv from "dotenv";
import express from "express";
import ShopifyOAuth from "../ShopifyOAuth";
import AdminApiScopes from "../ShopifyOAuth/AdminApiScopes";
import type { CallbackQueryObject, InstallRequestQueryObject } from "../types";
dotenv.config();

const shopifyOAuth = new ShopifyOAuth({
  apiKey: process.env.SHOPIFY_API_KEY ?? "",
  apiSecret: process.env.SHOPIFY_API_SECRET ?? "",
  clientCallbackURL: "https://e3042cae8515.ngrok.io/auth/callback", // make sure to change this
}); // you can also pass persistent storage handler as documented in the readme.

const app = express();

app.get(
  "/",
  (
    req: express.Request<unknown, unknown, unknown, InstallRequestQueryObject>,
    res
  ) => {
    shopifyOAuth.handleInstallRequest({
      query: req.query,
      scopes: [
        AdminApiScopes.read_product_listings,
        AdminApiScopes.write.products, // write access also implies read access
        AdminApiScopes.write.customers,
        AdminApiScopes.write.orders,
      ],
      handlers: {
        async onInstalled() {
          res.send("Welcome to the App!");
        },
        async onError(e) {
          console.log(e);
          res.status(400).send({
            error: e,
          });
        },
        async redirectToShopifyInstall(url) {
          res.redirect(url);
        },
      },
    });
  }
);

app.get(
  "/auth/callback",
  async (
    req: express.Request<unknown, unknown, unknown, CallbackQueryObject>,
    res
  ) => {
    shopifyOAuth.handleCallbackRequest({
      query: req.query,
      handlers: {
        async onError(e) {
          console.log(e);
          res.status(400).send({
            error: e,
          });
        },
        async onOAuthComplete(tokenData) {
          console.log(`Token received `, tokenData);
          res.redirect(`https://${req.query.shop}/admin/apps/akros`);
        },
      },
    });
  }
);

export async function startServer(): Promise<void> {
  app.listen(3000, () => {
    console.log("App started at port 3000");
  });
}

startServer();
