"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionsTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const schema_1 = __importDefault(require("../../schema"));
const user_1 = require("../user/user");
const types_1 = require("../../db_types/types");
const drizzle_orm_1 = require("drizzle-orm");
exports.subscriptionsTable = schema_1.default.table("subscriptions", {
    id: (0, pg_core_1.uuid)("id")
        .primaryKey()
        .unique()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`)
        .notNull(),
    userId: (0, pg_core_1.uuid)("user_id")
        .references(() => user_1.usersTable.id, { onDelete: "cascade" })
        .notNull(),
    subscriptionId: (0, pg_core_1.text)("subscription_id").notNull(),
    customerId: (0, pg_core_1.uuid)("customer_id").notNull(),
    status: (0, types_1.subscriptionStatusEnum)("status").default("ACTIVE").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true }).$onUpdate(() => new Date())
}, (table) => {
    return {
        userIdIndex: (0, pg_core_1.index)("user_id_index_on_subscriptions").on(table.userId),
        subscriptionIdIndex: (0, pg_core_1.index)("subscription_id_index_on_subscriptions").on(table.subscriptionId),
        customerIdIndex: (0, pg_core_1.index)("customer_id_index_on_subscriptions").on(table.customerId)
    };
});
exports.default = exports.subscriptionsTable;
