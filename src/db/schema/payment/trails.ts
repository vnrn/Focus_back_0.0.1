import { index, timestamp, uuid } from "drizzle-orm/pg-core";
import Focus from "../schema";
import { usersTable } from "../user/user";
import { sql } from "drizzle-orm";

export const trailsTable = Focus.table(
  "trails",
  {
    id: uuid("id")
      .primaryKey()
      .unique()
      .default(sql`gen_random_uuid()`)
      .notNull(),
    userId: uuid("user_id")
      .unique()
      .references(() => usersTable.id)
      .notNull(),
    startedAt: timestamp("started_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    )
  },
  (table) => {
    return {
      userIdIndex: index("user_id_index_on_trails").on(table.userId)
    };
  }
);

export default trailsTable;
