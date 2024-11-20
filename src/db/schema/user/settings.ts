import { boolean, index, uuid } from "drizzle-orm/pg-core";
import Focus from "../schema";
import { usersTable } from "./user";
import { ThemeEnum } from "../db_types/types";
import { sql } from "drizzle-orm";

export const settingsTable = Focus.table(
  "settings",
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

    // prefrences
    theme: ThemeEnum("theme").default("DARK").notNull(),

    //notifications
    pushNotifications: boolean("push_notifications").default(true).notNull(),
    pushEmailNotifications: boolean("push_email_notifications")
      .default(true)
      .notNull(),

    //privacy
    isPrivate: boolean("is_private").default(false).notNull(),
    showOnlineStatus: boolean("show_online_status").default(false).notNull()
  },
  (table) => {
    return {
      userIdIndex: index("user_id_index_on_settings").on(table.userId)
    };
  }
);

export default settingsTable;
