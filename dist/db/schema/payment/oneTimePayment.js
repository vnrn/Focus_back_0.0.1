"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.oneTimePaymentTable = void 0;
const schema_1 = __importDefault(require("../schema"));
const pg_core_1 = require("drizzle-orm/pg-core");
const user_1 = require("../user/user");
const drizzle_orm_1 = require("drizzle-orm");
exports.oneTimePaymentTable = schema_1.default.table("one_time_payments", {
    id: (0, pg_core_1.uuid)("id")
        .primaryKey()
        .unique()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`)
        .notNull(),
    userId: (0, pg_core_1.uuid)("user_id")
        .references(() => user_1.usersTable.id, { onDelete: "cascade" })
        .notNull()
        .unique(),
    amount: (0, pg_core_1.integer)("amount").default(0).notNull(),
    createdAt: (0, pg_core_1.varchar)("created_at", { length: 255 }).notNull()
}, (table) => {
    return {
        userIdIndex: (0, pg_core_1.index)("user_id_index_on_one_time_payments").on(table.userId)
    };
});
exports.default = exports.oneTimePaymentTable;
