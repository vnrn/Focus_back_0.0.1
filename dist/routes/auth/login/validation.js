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
exports.default = LoginValidation;
const zod_1 = __importDefault(require("zod"));
function LoginValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { usernameOrEmail, password } = req.body;
        const LoginSchema = zod_1.default.object({
            usernameOrEmail: zod_1.default
                .string({ message: "sorry, username must be a string." })
                .min(1, {
                message: "please, enter your username or email."
            })
                .min(3, {
                message: "sorry, Username or Email must be at least 3 characters."
            })
                .max(30, { message: "sorry, Username cannot exceed 30 characters" }),
            password: zod_1.default.string({ message: "please, enter your password" })
        });
        const result = yield LoginSchema.safeParseAsync({
            usernameOrEmail,
            password
        });
        if (result.success) {
            // Validation succeeded, proceed to the next middleware
            next();
        }
        else {
            // Validation failed, return errors
            const formattedErrors = result.error.errors.map((err) => ({
                field: err.path[0],
                message: err.message
            }));
            res.status(400).json({
                from: "zod",
                errors: formattedErrors
            });
        }
    });
}
