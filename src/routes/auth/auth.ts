import { Router } from "express";
import SignupHandler from "./signup/route";

const AuthRouter = Router();

AuthRouter.post("/signup", SignupHandler);

export default AuthRouter;
