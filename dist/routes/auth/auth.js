"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route_1 = __importDefault(require("./signup/route"));
const validation_1 = __importDefault(require("./signup/validation"));
const route_2 = __importDefault(require("./login/route"));
const validation_2 = __importDefault(require("./login/validation"));
const AuthRouter = (0, express_1.Router)();
AuthRouter.post("/signup", validation_1.default, route_1.default);
AuthRouter.post("/login", validation_2.default, route_2.default);
exports.default = AuthRouter;
