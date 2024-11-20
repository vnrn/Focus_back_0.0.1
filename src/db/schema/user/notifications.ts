import { boolean, index, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import Focus from "../schema";
import { usersTable } from "./user";
import { LinkTargetEnum } from "../db_types/types";
import { sql } from "drizzle-orm";

export const notificationsTable = Focus.table(
  "notifications",
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
    from: varchar("title", { length: 100 }).notNull(),
    title: varchar("title", { length: 100 }).notNull(),
    description: varchar("description", { length: 255 }),
    hasButton: boolean("has_button").default(false).notNull(),
    buttonLabel: varchar("button_label", { length: 100 }),
    buttonLink: varchar("button_link", { length: 255 }),
    buttonLinkTarget: LinkTargetEnum("button_link_target")
      .default("_blank")
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    seenAt: timestamp("seen_at", { withTimezone: true })
  },
  (table) => {
    return {
      userIdIndex: index("user_id_index_on_notifications").on(table.userId)
    };
  }
);

export default notificationsTable;
