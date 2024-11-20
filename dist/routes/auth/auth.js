"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route_1 = __importDefault(require("./signup/route"));
const AuthRouter = (0, express_1.Router)();
AuthRouter.post("/signup", route_1.default);
exports.default = AuthRouter;
