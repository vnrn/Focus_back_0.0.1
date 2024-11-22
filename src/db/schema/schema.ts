import { pgSchema } from "drizzle-orm/pg-core";

// main schema structure
const Focus = pgSchema("Focus");
export const Analytics = pgSchema("Analytics");

export default Focus;
