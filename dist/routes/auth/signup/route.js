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
exports.default = SignupHandler;
const connect_1 = __importDefault(require("../../../db/connect"));
const user_1 = __importDefault(require("../../../db/schema/user/user"));
const drizzle_orm_1 = require("drizzle-orm");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
function SignupHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, email, password, reffer } = req.body;
        try {
            const isUserExists = yield connect_1.default
                .select({
                id: user_1.default.id,
                email: user_1.default.email,
                username: user_1.default.username
            })
                .from(user_1.default)
                .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(user_1.default.username, username), (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(user_1.default.email, email), (0, drizzle_orm_1.eq)(user_1.default.provider, "LOCAL"))))
                .limit(1);
            // check for username & email
            if (isUserExists.length > 0) {
                const isItUsername = isUserExists[0].username === username ? true : false;
                if (isItUsername) {
                    res.status(400).json({
                        from: "Focus",
                        error: "sorry, username is already taken."
                    });
                    return;
                }
                else {
                    res.status(400).json({
                        from: "Focus",
                        error: "sorry, email is already exists."
                    });
                    return;
                }
            }
            //main
            const hashedPassword = bcryptjs_1.default.hashSync(password, 7);
            const user = yield connect_1.default.insert(user_1.default).values({
                username,
                email,
                password: hashedPassword,
                provider: "LOCAL"
            });
            res.status(200).json({ message: "success" });
            //Message MQ Job Goes here
            return;
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error });
        }
    });
}
