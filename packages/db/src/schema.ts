import {
  pgTable,
  pgEnum,
  serial,
  text,
  varchar,
  integer,
  numeric,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ---------- Enums ----------

export const userRoleEnum = pgEnum("user_role", ["admin", "client"]);

export const menuCategoryEnum = pgEnum("menu_category", [
  "Starters",
  "Steaks",
  "Chicken",
  "Seafood",
  "Pasta",
  "Sandwiches",
  "Drinks",
]);

export const reservationStatusEnum = pgEnum("reservation_status", [
  "pending",
  "confirmed",
  "cancelled",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "preparing",
  "ready",
  "completed",
  "cancelled",
]);

// ---------- Users ----------
// Same table for admin + client, distinguished by `role`.
// Admin accounts should be created via a seed script, not public signup.

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 180 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  phone: varchar("phone", { length: 30 }),
  role: userRoleEnum("role").notNull().default("client"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ---------- Menu Items ----------

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  category: menuCategoryEnum("category").notNull(),
  description: text("description").notNull().default(""),
  image: text("image").notNull().default(""),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  isAvailable: boolean("is_available").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ---------- Reservations ----------
// userId is nullable so guests (not logged in) can still reserve a table,
// same as the current frontend form. Logged-in clients get it linked.

export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  name: varchar("name", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
  time: varchar("time", { length: 5 }).notNull(), // HH:MM
  guests: integer("guests").notNull(),
  request: text("request").notNull().default(""),
  status: reservationStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ---------- Orders ----------

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  status: orderStatusEnum("status").notNull().default("pending"),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 })
    .notNull()
    .default("0"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ---------- Order Items ----------
// priceAtOrder snapshots the menu price at order time, so later menu
// price changes don't rewrite historical order totals.

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),
  menuItemId: integer("menu_item_id")
    .references(() => menuItems.id, { onDelete: "restrict" })
    .notNull(),
  quantity: integer("quantity").notNull().default(1),
  priceAtOrder: numeric("price_at_order", { precision: 10, scale: 2 }).notNull(),
});

// ---------- Relations (for drizzle's relational query API) ----------

export const usersRelations = relations(users, ({ many }) => ({
  reservations: many(reservations),
  orders: many(orders),
}));

export const reservationsRelations = relations(reservations, ({ one }) => ({
  user: one(users, {
    fields: [reservations.userId],
    references: [users.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  menuItem: one(menuItems, {
    fields: [orderItems.menuItemId],
    references: [menuItems.id],
  }),
}));

export const menuItemsRelations = relations(menuItems, ({ many }) => ({
  orderItems: many(orderItems),
}));
