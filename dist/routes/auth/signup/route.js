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
const user_1 = __importDefault(require("../../../db/schema/Focus/user/user"));
const drizzle_orm_1 = require("drizzle-orm");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Tokens_1 = require("../../../lib/Tokens");
const SignupQueue_1 = __importDefault(require("../../../Queues/SignupQueue"));
function SignupHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, email, password, reffer: Reffer } = req.body;
        const IPP = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
        const IP = IPP ? IPP.toString() : "NULL";
        const reffer = Reffer ? Reffer.toString() : "";
        try {
            const isUserExists = yield connect_1.default
                .select()
                .from(user_1.default)
                .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(user_1.default.username, username), (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(user_1.default.email, email), (0, drizzle_orm_1.eq)(user_1.default.provider, "LOCAL"))))
                .limit(1);
            // check for username & email
            if (isUserExists.length > 0) {
                const isItUsername = isUserExists[0].username === username ? true : false;
                if (isItUsername) {
                    res.status(400).json({
                        from: "Focus",
                        errors: [
                            {
                                field: "username",
                                message: "sorry, username is already taken."
                            }
                        ]
                    });
                    return;
                }
                else {
                    res.status(400).json({
                        from: "Focus",
                        errors: [
                            {
                                field: "email",
                                message: "sorry, email is already exists."
                            }
                        ]
                    });
                    return;
                }
            }
            //main
            const hashedPassword = bcryptjs_1.default.hashSync(password, 7);
            const verifyToken = (0, Tokens_1.generateRandomToken)();
            const user = yield connect_1.default
                .insert(user_1.default)
                .values({
                username,
                email,
                password: hashedPassword,
                provider: "LOCAL",
                verifyToken: verifyToken,
                verifyTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                IP: IP
            })
                .returning({
                id: user_1.default.id,
                email: user_1.default.email
            });
            //queue
            yield SignupQueue_1.default.add({
                payload: {
                    userId: user[0].id,
                    email: user[0].email ? user[0].email : null,
                    verifyToken: verifyToken,
                    reffer: reffer,
                    provider: "LOCAL"
                }
            })
                .then(() => {
                console.log("signup job added to queue");
            })
                .catch((error) => {
                console.log(error);
                throw new Error(error);
            });
            res.status(200).json({ message: "success" });
            return;
        }
        catch (error) {
            throw new Error(error);
            res.status(500).json({ error });
        }
    });
}
