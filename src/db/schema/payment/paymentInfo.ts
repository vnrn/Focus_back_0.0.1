import { index, timestamp, uuid } from "drizzle-orm/pg-core";
import Focus from "../schema";
import { usersTable } from "../user/user";
import { sql } from "drizzle-orm";

export const paymentInfoTable = Focus.table(
  "payment_info",
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
    stripeCustomerId: uuid("stripe_customer_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    )
  },
  (table) => {
    return {
      userIdIndex: index("user_id_index_on_payment_info").on(table.userId),
      stripeCustomerIdIndex: index(
        "stripe_customer_id_index_on_payment_info"
      ).on(table.stripeCustomerId)
    };
  }
);

export default paymentInfoTable;
