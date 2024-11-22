import { uuid, varchar, text, timestamp, index } from "drizzle-orm/pg-core";
import Focus from "../../schema";
import { ProviderEnum } from "../../db_types/types";
import { sql } from "drizzle-orm";

export const usersTable = Focus.table(
  "users",
  {
    id: uuid("id")
      .primaryKey()
      .unique()
      .default(sql`gen_random_uuid()`)
      .notNull(),
    username: varchar("username", { length: 35 }).unique().notNull(),
    email: varchar("email", { length: 255 }),
    password: text("password"),
    provider: ProviderEnum("provider").default("LOCAL").notNull(),
    providerId: text("provider_id").unique(),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    verifyToken: text("verify_token"),
    deleteToken: text("delete_token"),
    IP: text("ip"),
    verifyTokenExpiresAt: timestamp("verify_token_expires_at", {
      withTimezone: true
    }),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    lastLogin: timestamp("last_login", { withTimezone: true }),
    lastOnlineAt: timestamp("last_online_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    )
  },
  (table) => {
    return {
      usernameIndex: index("username_index_on_users").on(table.username),
      emailIndex: index("email_index_on_users").on(table.email),
      providerIdIndex: index("provider_id_index_on_users").on(table.providerId),
      verifyTokenIndex: index("verify_token_index_on_users").on(
        table.verifyToken
      )
    };
  }
);

export default usersTable;
