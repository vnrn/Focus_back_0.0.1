"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationsTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const schema_1 = __importDefault(require("../schema"));
const user_1 = require("./user");
const types_1 = require("../db_types/types");
const drizzle_orm_1 = require("drizzle-orm");
exports.notificationsTable = schema_1.default.table("notifications", {
    id: (0, pg_core_1.uuid)("id")
        .primaryKey()
        .unique()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`)
        .notNull(),
    userId: (0, pg_core_1.uuid)("user_id")
        .references(() => user_1.usersTable.id, { onDelete: "cascade" })
        .notNull()
        .unique(),
    from: (0, pg_core_1.varchar)("title", { length: 100 }).notNull(),
    title: (0, pg_core_1.varchar)("title", { length: 100 }).notNull(),
    description: (0, pg_core_1.varchar)("description", { length: 255 }),
    hasButton: (0, pg_core_1.boolean)("has_button").default(false).notNull(),
    buttonLabel: (0, pg_core_1.varchar)("button_label", { length: 100 }),
    buttonLink: (0, pg_core_1.varchar)("button_link", { length: 255 }),
    buttonLinkTarget: (0, types_1.LinkTargetEnum)("button_link_target")
        .default("_blank")
        .notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow(),
    seenAt: (0, pg_core_1.timestamp)("seen_at", { withTimezone: true })
}, (table) => {
    return {
        userIdIndex: (0, pg_core_1.index)("user_id_index_on_notifications").on(table.userId)
    };
});
exports.default = exports.notificationsTable;
