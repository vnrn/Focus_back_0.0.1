import { index, text, timestamp, uuid } from "drizzle-orm/pg-core";
import Focus from "../schema";
import { usersTable } from "../user/user";
import { subscriptionStatusEnum } from "../db_types/types";
import { sql } from "drizzle-orm";

export const subscriptionsTable = Focus.table(
  "subscriptions",
  {
    id: uuid("id")
      .primaryKey()
      .unique()
      .default(sql`gen_random_uuid()`)
      .notNull(),
    userId: uuid("user_id")
      .references(() => usersTable.id, { onDelete: "cascade" })
      .notNull(),
    subscriptionId: text("subscription_id").notNull(),
    customerId: uuid("customer_id").notNull(),
    status: subscriptionStatusEnum("status").default("ACTIVE").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    )
  },
  (table) => {
    return {
      userIdIndex: index("user_id_index_on_subscriptions").on(table.userId),
      subscriptionIdIndex: index("subscription_id_index_on_subscriptions").on(
        table.subscriptionId
      ),
      customerIdIndex: index("customer_id_index_on_subscriptions").on(
        table.customerId
      )
    };
  }
);

export default subscriptionsTable;
