import { index, text, timestamp, uuid } from "drizzle-orm/pg-core";
import Focus from "../schema";
import { subscriptionsTable } from "./subscriptions";
import { SubscriptionsEventsNamesEnum } from "../db_types/types";
import { sql } from "drizzle-orm";

export const subscriptionsEventsTable = Focus.table(
  "subscriptions_events",
  {
    id: uuid("id")
      .primaryKey()
      .unique()
      .default(sql`gen_random_uuid()`)
      .notNull(),
    subscriptionId: uuid("subscription_id")
      .references(() => subscriptionsTable.id, { onDelete: "cascade" })
      .notNull(),
    eventName: SubscriptionsEventsNamesEnum("event_name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    )
  },
  (table) => {
    return {
      subscriptionIdIndex: index(
        "subscription_id_index_on_subscriptions_events"
      ).on(table.subscriptionId)
    };
  }
);

export default subscriptionsEventsTable;
