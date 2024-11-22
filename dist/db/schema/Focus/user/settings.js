"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const schema_1 = __importDefault(require("../../schema"));
const user_1 = require("./user");
const types_1 = require("../../db_types/types");
const drizzle_orm_1 = require("drizzle-orm");
exports.settingsTable = schema_1.default.table("settings", {
    id: (0, pg_core_1.uuid)("id")
        .primaryKey()
        .unique()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`)
        .notNull(),
    userId: (0, pg_core_1.uuid)("user_id")
        .references(() => user_1.usersTable.id, { onDelete: "cascade" })
        .notNull()
        .unique(),
    // prefrences
    theme: (0, types_1.ThemeEnum)("theme").default("DARK").notNull(),
    //notifications
    pushNotifications: (0, pg_core_1.boolean)("push_notifications").default(true).notNull(),
    pushEmailNotifications: (0, pg_core_1.boolean)("push_email_notifications")
        .default(true)
        .notNull(),
    //privacy
    isPrivate: (0, pg_core_1.boolean)("is_private").default(false).notNull(),
    showOnlineStatus: (0, pg_core_1.boolean)("show_online_status").default(false).notNull()
}, (table) => {
    return {
        userIdIndex: (0, pg_core_1.index)("user_id_index_on_settings").on(table.userId)
    };
});
exports.default = exports.settingsTable;
