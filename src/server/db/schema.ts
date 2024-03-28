import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { type AdapterAccount } from "next-auth/adapters";

import { type InferSelectModel } from "drizzle-orm";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(
  (name) => `url_shortner_demo_${name}`,
);

export const urls = createTable(
  "url",
  {
    id: varchar("id", { length: 255 }).primaryKey().$defaultFn(nanoid),
    tinyurl: varchar("tinyurl", { length: 255 })
      .notNull()
      .unique()
      .$defaultFn(() => nanoid(5)),
    forwardedTo: varchar("fowarded_to", { length: 255 }).notNull(),
    isAuthRequired: boolean("auth_required").notNull().default(false),
    isNotificationRequired: boolean("notification_required")
      .notNull()
      .default(false),
    startTime: timestamp("start_time").notNull().defaultNow(),
    endTime: timestamp("end_time").notNull(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    TimesClicked: integer("times_clicked").default(0).notNull(),
  },
  (table) => ({
    tinyurlIdx: uniqueIndex("tinyurl_idx").on(table.tinyurl),
  }),
);

export type UrlType = InferSelectModel<typeof urls>;

export const urlsRelation = relations(urls, ({ one }) => ({
  user: one(users, { fields: [urls.userId], references: [users.id] }),
}));

export const users = createTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  urls: many(urls),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);
