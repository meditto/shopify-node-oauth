"use strict";
/// <reference path="../types.d.ts" />
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const ShopifyOAuth_1 = __importDefault(require("../ShopifyOAuth"));
const AdminApiScopes_1 = __importDefault(require("../ShopifyOAuth/AdminApiScopes"));
dotenv_1.default.config();
const shopifyOAuth = new ShopifyOAuth_1.default({
    apiKey: process.env.SHOPIFY_API_KEY ?? "",
    apiSecret: process.env.SHOPIFY_API_SECRET ?? "",
    clientCallbackURL: "https://e3042cae8515.ngrok.io/auth/callback",
});
const app = express_1.default();
app.get("/", (req, res) => {
    shopifyOAuth.handleInstallRequest({
        query: req.query,
        scopes: [
            AdminApiScopes_1.default.ProductListings,
            AdminApiScopes_1.default.Products.Read,
            AdminApiScopes_1.default.Products.Write,
            AdminApiScopes_1.default.Customers.Read,
            AdminApiScopes_1.default.Customers.Write,
            AdminApiScopes_1.default.Orders.Read,
            AdminApiScopes_1.default.Orders.Write,
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
});
app.get("/auth/callback", async (req, res) => {
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
});
async function startServer() {
    app.listen(3000, () => {
        console.log("App started at port 3000");
    });
}
exports.startServer = startServer;
startServer();
//# sourceMappingURL=index.js.map