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
exports.default = LoginHandler;
const connect_1 = __importDefault(require("../../../db/connect"));
const user_1 = __importDefault(require("../../../db/schema/Focus/user/user"));
const drizzle_orm_1 = require("drizzle-orm");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Tokens_1 = require("../../../lib/Tokens");
const ms_1 = __importDefault(require("ms"));
function LoginHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { usernameOrEmail, password } = req.body;
        try {
            const user = yield connect_1.default
                .select()
                .from(user_1.default)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(user_1.default.username, usernameOrEmail), (0, drizzle_orm_1.eq)(user_1.default.email, usernameOrEmail)), (0, drizzle_orm_1.eq)(user_1.default.provider, "LOCAL")))
                .limit(1);
            if (user.length === 0) {
                const isFoundByEmail = usernameOrEmail.includes("@") ? true : false;
                res.status(404).json({
                    from: "Focus",
                    errors: [
                        {
                            field: "usernameOrEmail",
                            message: `sorry, we couldn't find an account with that ${isFoundByEmail ? "email address" : "username"}.`
                        }
                    ]
                });
                return;
            }
            const isPasswordCorrect = yield bcryptjs_1.default.compare(password, user[0].password);
            if (!isPasswordCorrect) {
                res.status(401).json({
                    from: "Focus",
                    errors: [
                        {
                            field: "password",
                            message: "sorry, your password is incorrect."
                        }
                    ]
                });
                return;
            }
            yield connect_1.default
                .update(user_1.default)
                .set({ lastLogin: new Date() })
                .where((0, drizzle_orm_1.eq)(user_1.default.id, user[0].id));
            //generate tokens (refresh & access)
            const refToken = (0, Tokens_1.generateJwtToken)({
                payload: { userId: user[0].id, provider: user[0].provider },
                expiresIn: (0, ms_1.default)("120 days")
            });
            const accessToken = (0, Tokens_1.generateAccessTokenFromRefreshToken)(refToken);
            res.status(200);
            res.cookie("refreshToken", refToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: (0, ms_1.default)("120 days")
            });
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: (0, ms_1.default)("20s")
            });
            res.json({
                from: "Focus",
                data: {
                    refreshToken: refToken,
                    accessToken
                }
            });
            return;
        }
        catch (error) {
            next(error);
            throw new Error(error);
        }
    });
}
