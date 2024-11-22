import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as Schema from "./schema";
import "dotenv/config";

const pool = new Pool({
  connectionString: process.env.DB_URL
});

const db = drizzle(pool, { schema: Schema });
const connection = db.$client.connect();

connection
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    throw new Error(err);
    console.log("Faild to connect to database");
  });

export default db;
