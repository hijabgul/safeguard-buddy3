import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const distressAlerts = pgTable("distress_alerts", {
  id: serial().primaryKey(),
  childNickname: text("child_nickname").notNull(),
  ageBracket: text("age_bracket").notNull(),
  triggerWord: text("trigger_word").notNull(),
  contextMessage: text("context_message").notNull(),
  salamResponse: text("salam_response").notNull(),
  status: text().notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});
