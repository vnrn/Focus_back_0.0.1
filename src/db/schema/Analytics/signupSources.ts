import { index, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { Analytics } from "../schema";
import { sql } from "drizzle-orm";
import usersTable from "../Focus/user/user";

export const userSignupSourcesTable = Analytics.table(
  "user_signup_sources",
  {
    id: uuid("id")
      .primaryKey()
      .unique()
      .default(sql`gen_random_uuid()`)
      .notNull(),
    source: varchar("source", { length: 255 }).notNull(),
    userId: uuid("user_id").references(() => usersTable.id, {
      onDelete: "set null"
    }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
  },
  (table) => {
    return {
      sourceIndex: index("source_index_on_user_signup_sources").on(table.source)
    };
  }
);

export default userSignupSourcesTable;
