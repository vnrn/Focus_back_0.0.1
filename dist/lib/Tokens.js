"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomToken = generateRandomToken;
exports.generateJwtToken = generateJwtToken;
exports.generateAccessTokenFromRefreshToken = generateAccessTokenFromRefreshToken;
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const ms_1 = __importDefault(require("ms"));
function generateRandomToken(length = 32) {
    return crypto_1.default.randomBytes(length).toString("hex");
}
function generateJwtToken({ payload, expiresIn }) {
    if (!process.env.JWT_SECRET)
        throw new Error("JWT_SECRET is not defined");
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn });
}
function generateAccessTokenFromRefreshToken(refreshToken) {
    console.log(process.env.JWT_SECRET);
    if (!process.env.JWT_SECRET)
        throw new Error("JWT_SECRET is not defined");
    try {
        const payload = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_SECRET);
        const { iat, exp } = payload, rest = __rest(payload, ["iat", "exp"]);
        return jsonwebtoken_1.default.sign(rest, process.env.JWT_SECRET, {
            expiresIn: (0, ms_1.default)("20s")
        });
    }
    catch (error) {
        console.log(error);
        return null;
    }
}
