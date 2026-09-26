CREATE TABLE "distress_alerts" (
	"id" serial PRIMARY KEY,
	"child_nickname" text NOT NULL,
	"age_bracket" text NOT NULL,
	"trigger_word" text NOT NULL,
	"context_message" text NOT NULL,
	"salam_response" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
