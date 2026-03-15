"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notion = void 0;
exports.requiredEnv = requiredEnv;
var client_1 = require("@notionhq/client");
var dotenv_1 = require("dotenv");
var path_1 = require("path");
var url_1 = require("url");
function requiredEnv(name) {
    var value = process.env[name];
    if (!value)
        throw new Error("Missing env: ".concat(name));
    return value;
}
var __dirname = path_1.default.dirname((0, url_1.fileURLToPath)(import.meta.url));
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), ".env") });
exports.notion = new client_1.Client({
    auth: requiredEnv("NOTION_API_KEY"),
});
