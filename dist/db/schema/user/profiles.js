"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profilesTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const schema_1 = __importDefault(require("../schema"));
const user_1 = require("./user");
const types_1 = require("../db_types/types");
const drizzle_orm_1 = require("drizzle-orm");
exports.profilesTable = schema_1.default.table("profiles", {
    id: (0, pg_core_1.uuid)("id")
        .primaryKey()
        .unique()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`)
        .notNull(),
    userId: (0, pg_core_1.uuid)("user_id")
        .references(() => user_1.usersTable.id)
        .notNull()
        .unique(),
    name: (0, pg_core_1.varchar)("name", { length: 100 }).notNull(),
    bio: (0, pg_core_1.varchar)("bio", { length: 255 }),
    avatarUrl: (0, pg_core_1.varchar)("avatar_url", { length: 255 }),
    selectedAvatar: (0, types_1.ProviderEnum)("selected_avatar").default("LOCAL").notNull(),
    gender: (0, types_1.GenderEnum)("gender").default("PREFER_NOT_TO_SAY").notNull(),
    wishes: (0, pg_core_1.integer)("wishes").default(0).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true }).$onUpdate(() => new Date())
}, (table) => {
    return {
        userIdIndex: (0, pg_core_1.index)("user_id_index_on_profiles").on(table.userId),
        nameIndex: (0, pg_core_1.index)("name_index_on_profiles").on(table.name)
    };
});
exports.default = exports.profilesTable;
