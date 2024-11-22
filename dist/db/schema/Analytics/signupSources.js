"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSignupSourcesTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const schema_1 = require("../schema");
const drizzle_orm_1 = require("drizzle-orm");
const user_1 = __importDefault(require("../Focus/user/user"));
exports.userSignupSourcesTable = schema_1.Analytics.table("user_signup_sources", {
    id: (0, pg_core_1.uuid)("id")
        .primaryKey()
        .unique()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`)
        .notNull(),
    source: (0, pg_core_1.varchar)("source", { length: 255 }).notNull(),
    userId: (0, pg_core_1.uuid)("user_id").references(() => user_1.default.id, {
        onDelete: "set null"
    }),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow()
}, (table) => {
    return {
        sourceIndex: (0, pg_core_1.index)("source_index_on_user_signup_sources").on(table.source)
    };
});
exports.default = exports.userSignupSourcesTable;
