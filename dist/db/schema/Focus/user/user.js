"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const schema_1 = __importDefault(require("../../schema"));
const types_1 = require("../../db_types/types");
const drizzle_orm_1 = require("drizzle-orm");
exports.usersTable = schema_1.default.table("users", {
    id: (0, pg_core_1.uuid)("id")
        .primaryKey()
        .unique()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`)
        .notNull(),
    username: (0, pg_core_1.varchar)("username", { length: 35 }).unique().notNull(),
    email: (0, pg_core_1.varchar)("email", { length: 255 }),
    password: (0, pg_core_1.text)("password"),
    provider: (0, types_1.ProviderEnum)("provider").default("LOCAL").notNull(),
    providerId: (0, pg_core_1.text)("provider_id").unique(),
    accessToken: (0, pg_core_1.text)("access_token"),
    refreshToken: (0, pg_core_1.text)("refresh_token"),
    verifyToken: (0, pg_core_1.text)("verify_token"),
    deleteToken: (0, pg_core_1.text)("delete_token"),
    IP: (0, pg_core_1.text)("ip"),
    verifyTokenExpiresAt: (0, pg_core_1.timestamp)("verify_token_expires_at", {
        withTimezone: true
    }),
    verifiedAt: (0, pg_core_1.timestamp)("verified_at", { withTimezone: true }),
    lastLogin: (0, pg_core_1.timestamp)("last_login", { withTimezone: true }),
    lastOnlineAt: (0, pg_core_1.timestamp)("last_online_at", { withTimezone: true }),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true }).$onUpdate(() => new Date())
}, (table) => {
    return {
        usernameIndex: (0, pg_core_1.index)("username_index_on_users").on(table.username),
        emailIndex: (0, pg_core_1.index)("email_index_on_users").on(table.email),
        providerIdIndex: (0, pg_core_1.index)("provider_id_index_on_users").on(table.providerId),
        verifyTokenIndex: (0, pg_core_1.index)("verify_token_index_on_users").on(table.verifyToken)
    };
});
exports.default = exports.usersTable;
