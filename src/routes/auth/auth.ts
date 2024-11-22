import { Router } from "express";
import SignupHandler from "./signup/route";
import SignupValidation from "./signup/validation";
import LoginHandler from "./login/route";
import LoginValidation from "./login/validation";

const AuthRouter = Router();

AuthRouter.post("/signup", SignupValidation, SignupHandler);
AuthRouter.post("/login", LoginValidation, LoginHandler);
export default AuthRouter;
