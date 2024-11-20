"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentInfoTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const schema_1 = __importDefault(require("../schema"));
const user_1 = require("../user/user");
const drizzle_orm_1 = require("drizzle-orm");
exports.paymentInfoTable = schema_1.default.table("payment_info", {
    id: (0, pg_core_1.uuid)("id")
        .primaryKey()
        .unique()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`)
        .notNull(),
    userId: (0, pg_core_1.uuid)("user_id")
        .references(() => user_1.usersTable.id, { onDelete: "cascade" })
        .notNull()
        .unique(),
    stripeCustomerId: (0, pg_core_1.uuid)("stripe_customer_id").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true }).$onUpdate(() => new Date())
}, (table) => {
    return {
        userIdIndex: (0, pg_core_1.index)("user_id_index_on_payment_info").on(table.userId),
        stripeCustomerIdIndex: (0, pg_core_1.index)("stripe_customer_id_index_on_payment_info").on(table.stripeCustomerId)
    };
});
exports.default = exports.paymentInfoTable;
