import express, {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
  Router
} from "express";
import db from "./db/connect";
import usersTable from "./db/schema/Focus/user/user";
import Redis from "./redis/connect";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import AuthRouter from "./routes/auth/auth";

const mainServer = express();

let port = process.env.PORT || 3000;
const app = Router();

//public middlewares
mainServer.use("/api", app);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONT_ORIGIN as string,
    credentials: true
  })
);

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.get("/status", async (req, res) => {
  try {
    const count = await db.$count(usersTable);
    const redis = await Redis.ping();
    res.json({ count, redis });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

app.use("/auth", AuthRouter);
mainServer.use(
  (
    err: ErrorRequestHandler,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ message: "Something went wrong!" });
  }
);
mainServer.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
