"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionsEventsNamesEnum = exports.subscriptionStatusEnum = exports.LinkTargetEnum = exports.GenderEnum = exports.ThemeEnum = exports.ProviderEnum = void 0;
const schema_1 = __importDefault(require("../schema"));
exports.ProviderEnum = schema_1.default.enum("Provider", [
    "GOOGLE",
    "GITHUB",
    "LOCAL"
]);
exports.ThemeEnum = schema_1.default.enum("Theme", ["LIGHT", "DARK"]);
exports.GenderEnum = schema_1.default.enum("Gender", [
    "MALE",
    "FEMALE",
    "PREFER_NOT_TO_SAY"
]);
exports.LinkTargetEnum = schema_1.default.enum("LinkTarget", ["_self", "_blank"]);
exports.subscriptionStatusEnum = schema_1.default.enum("SubscriptionStatus", [
    "ACTIVE",
    "EXPIRED",
    "CANCELLED"
]);
exports.SubscriptionsEventsNamesEnum = schema_1.default.enum("SubscriptionsEventsNames", ["AUTO_RESUBSCRIBE", "EXPIRED", "CANCELLED"]);
