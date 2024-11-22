import { Redis as IoRedis } from "ioredis";
import "dotenv/config";

const redisUrl = process.env.REDIS_URL as string;
if (!redisUrl) throw new Error("REDIS_URL is not defined");
console.log(redisUrl);

const Redis = new IoRedis(`${redisUrl}/0`, {
  lazyConnect: true
});
export default Redis;
