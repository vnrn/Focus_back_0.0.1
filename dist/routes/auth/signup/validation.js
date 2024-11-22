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
exports.default = SignupValidation;
const zod_1 = __importDefault(require("zod"));
function SignupValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, email, password, reffer } = req.body;
        const result = schema.safeParse({ username, email, password, reffer });
        if (!result.success) {
            const errors = result.error.issues.map((issue) => {
                return {
                    field: issue.path[0],
                    message: issue.message
                };
            });
            res.status(400).json(errors);
            return;
        }
        else {
            next();
        }
    });
}
const schema = zod_1.default.object({
    username: zod_1.default
        .string({ message: "sorry, username must be a string." })
        .regex(/^[a-zA-Z0-9_]+$/, {
        message: "sorry, username can only contain letters, numbers, and underscores."
    })
        .min(3, { message: "sorry, Username must be at least 3 characters." })
        .max(35, { message: "sorry, Username cannot exceed 35 characters." }),
    email: zod_1.default
        .string({ message: "sorry, email must be a string." })
        .email({ message: "please, enter a valid email address." }),
    password: zod_1.default
        .string({ message: "sorry, password must be a string." })
        .min(8, { message: "sorry, password must be at least 8 characters." })
        .regex(/[0-9]/, { message: "password must contain at least one number." })
        .regex(/[^a-zA-Z0-9]/, {
        message: "Password must contain at least one special character."
    }),
    reffer: zod_1.default
        .string({ message: "please, enter a string reffer." })
        .max(35, { message: "sorry, reffer cannot exceed 35 characters." })
        .regex(/^[a-zA-Z0-9_]+$/, {
        message: "sorry, reffer can only contain letters, numbers, and underscores."
    })
        .optional()
});
