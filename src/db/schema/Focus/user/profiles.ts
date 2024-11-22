import { index, integer, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import Focus from "../../schema";
import { usersTable } from "./user";
import { GenderEnum, ProviderEnum } from "../../db_types/types";
import { sql } from "drizzle-orm";

export const profilesTable = Focus.table(
  "profiles",
  {
    id: uuid("id")
      .primaryKey()
      .unique()
      .default(sql`gen_random_uuid()`)
      .notNull(),
    userId: uuid("user_id")
      .references(() => usersTable.id)
      .notNull()
      .unique(),
    name: varchar("name", { length: 100 }),
    bio: varchar("bio", { length: 255 }),
    avatarUrl: varchar("avatar_url", { length: 255 }),
    selectedAvatar: ProviderEnum("selected_avatar").default("LOCAL").notNull(),
    gender: GenderEnum("gender").default("PREFER_NOT_TO_SAY").notNull(),
    wishes: integer("wishes").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    )
  },
  (table) => {
    return {
      userIdIndex: index("user_id_index_on_profiles").on(table.userId),
      nameIndex: index("name_index_on_profiles").on(table.name)
    };
  }
);

export default profilesTable;
