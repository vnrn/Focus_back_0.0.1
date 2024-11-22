"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Analytics = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
// main schema structure
const Focus = (0, pg_core_1.pgSchema)("Focus");
exports.Analytics = (0, pg_core_1.pgSchema)("Analytics");
exports.default = Focus;
