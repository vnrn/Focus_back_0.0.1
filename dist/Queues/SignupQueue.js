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
const bull_1 = __importDefault(require("bull"));
require("dotenv/config");
const connect_1 = __importDefault(require("../db/connect"));
const settings_1 = __importDefault(require("../db/schema/Focus/user/settings"));
const profiles_1 = __importDefault(require("../db/schema/Focus/user/profiles"));
const trails_1 = __importDefault(require("../db/schema/Focus/payment/trails"));
const schema_1 = require("../db/schema");
const EmailSender_1 = __importDefault(require("../helpers/emails/EmailSender"));
const SignupQueue = new bull_1.default("signup-queue", `${process.env.REDIS_URL}/1`);
SignupQueue.process((job, done) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(job.data);
    const { userId, email, provider, verifyToken, reffer } = job.data.payload;
    if (!userId || typeof userId !== "string")
        throw new Error("userId is required");
    try {
        yield connect_1.default.transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            yield tx.insert(settings_1.default).values({
                userId: userId
            });
            yield tx.insert(profiles_1.default).values({
                userId: userId
            });
            yield tx.insert(trails_1.default).values({
                userId: userId,
                startedAt: new Date()
            });
            if (reffer && typeof reffer === "string") {
                console.log(reffer);
                yield tx.insert(schema_1.userSignupSourcesTable).values({
                    userId: userId,
                    source: reffer
                });
            }
        }));
        if (provider === "LOCAL") {
            if (!verifyToken && typeof verifyToken !== "string") {
                throw new Error("verify token is required when provider is LOCAL");
            }
            else if (!email && typeof email !== "string") {
                throw new Error("email is required when provider is LOCAL");
            }
            else if (!process.env.BASE_URL) {
                throw new Error("BASE_URL is not defined in env");
            }
            yield (0, EmailSender_1.default)({
                email: email,
                subject: "Account Verification",
                template: `<a href='${process.env.BASE_URL}/verify/` +
                    verifyToken +
                    "'>Verify Account</a>"
            });
        }
        done();
    }
    catch (error) {
        throw new Error(error);
    }
}));
exports.default = SignupQueue;
