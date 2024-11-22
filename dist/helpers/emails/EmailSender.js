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
const nodemailer_1 = __importDefault(require("nodemailer"));
require("dotenv/config");
function SendEmail(_a) {
    return __awaiter(this, arguments, void 0, function* ({ email, subject, template }) {
        if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
            throw new Error("EMAIL_USER or EMAIL_PASSWORD is not defined");
        }
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        try {
            const info = yield transporter.sendMail({
                from: process.env.EMAIL,
                to: email,
                subject,
                bcc: process.env.EMAIL,
                html: template
            });
            console.log(info.envelope);
        }
        catch (error) {
            throw new Error(error);
        }
    });
}
exports.default = SendEmail;
