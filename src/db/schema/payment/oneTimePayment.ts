import Focus from "../schema";
import { index, integer, uuid, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "../user/user";
import { sql } from "drizzle-orm";

export const oneTimePaymentTable = Focus.table(
  "one_time_payments",
  {
    id: uuid("id")
      .primaryKey()
      .unique()
      .default(sql`gen_random_uuid()`)
      .notNull(),
    userId: uuid("user_id")
      .references(() => usersTable.id, { onDelete: "cascade" })
      .notNull()
      .unique(),
    amount: integer("amount").default(0).notNull(),
    createdAt: varchar("created_at", { length: 255 }).notNull()
  },
  (table) => {
    return {
      userIdIndex: index("user_id_index_on_one_time_payments").on(table.userId)
    };
  }
);

export default oneTimePaymentTable;
