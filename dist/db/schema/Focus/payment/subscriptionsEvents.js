"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionsEventsTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const schema_1 = __importDefault(require("../../schema"));
const subscriptions_1 = require("./subscriptions");
const types_1 = require("../../db_types/types");
const drizzle_orm_1 = require("drizzle-orm");
exports.subscriptionsEventsTable = schema_1.default.table("subscriptions_events", {
    id: (0, pg_core_1.uuid)("id")
        .primaryKey()
        .unique()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`)
        .notNull(),
    subscriptionId: (0, pg_core_1.uuid)("subscription_id")
        .references(() => subscriptions_1.subscriptionsTable.id, { onDelete: "cascade" })
        .notNull(),
    eventName: (0, types_1.SubscriptionsEventsNamesEnum)("event_name").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true }).$onUpdate(() => new Date())
}, (table) => {
    return {
        subscriptionIdIndex: (0, pg_core_1.index)("subscription_id_index_on_subscriptions_events").on(table.subscriptionId)
    };
});
exports.default = exports.subscriptionsEventsTable;
