"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = VerifyAccountHandler;
exports.ResendVerificationEmailHandler = ResendVerificationEmailHandler;
const connect_1 = __importDefault(require("../../../db/connect"));
const user_1 = __importDefault(require("../../../db/schema/Focus/user/user"));
const drizzle_orm_1 = require("drizzle-orm");
require("dotenv/config");
function VerifyAccountHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { token, success_route, fail_route } = req.params;
        if (!process.env.FRONT_BASE_URL)
            throw new Error("FRONT_BASE_URL is not defined");
        if (!success_route) {
            res.redirect(`${process.env.FRONT_BASE_URL}`);
        }
        else if (!fail_route) {
            res.redirect(`${process.env.FRONT_BASE_URL}`);
        }
        if (!token) {
            res.redirect(`${process.env.FRONT_BASE_URL}${fail_route}?error=verify+missing+token`);
        }
        else if (typeof token !== "string") {
            res.redirect(`${process.env.FRONT_BASE_URL}${fail_route}?error=verify+invalid+token`);
        }
        else if (token.length !== 32) {
            res.redirect(`${process.env.FRONT_BASE_URL}${fail_route}?error=verify+invalid+token`);
        }
        try {
            const user = yield connect_1.default
                .select({
                id: user_1.default.id,
                verifiedAt: user_1.default.verifiedAt,
                verifyToken: user_1.default.verifyToken,
                verifyTokenExpiresAt: user_1.default.verifyTokenExpiresAt
            })
                .from(user_1.default)
                .where((0, drizzle_orm_1.eq)(user_1.default.verifyToken, token));
            if (user.length === 0) {
                res.redirect(`${process.env.FRONT_BASE_URL}${fail_route}?error=expired+link`);
            }
            else if (user[0].verifiedAt) {
                res.redirect(`${process.env.FRONT_BASE_URL}${fail_route}?error=account+already+verified`);
            }
            else if (user[0].verifyTokenExpiresAt < new Date()) {
                res.redirect(`${process.env.FRONT_BASE_URL}${fail_route}?error=expired+token`);
            }
            //verify the account
            yield connect_1.default
                .update(user_1.default)
                .set({
                verifiedAt: new Date(),
                verifyToken: null,
                verifyTokenExpiresAt: null
            })
                .where((0, drizzle_orm_1.eq)(user_1.default.id, user[0].id));
            res.redirect(`${process.env.FRONT_BASE_URL}${success_route}`);
        }
        catch (error) {
            console.log(error);
            res.redirect(`${process.env.FRONT_BASE_URL}${fail_route}?error=unexpected+error`);
        }
    });
}
function ResendVerificationEmailHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        //need accesToken will complete it after i make the middleware today is 22/11/2024
        // const { }
    });
}
