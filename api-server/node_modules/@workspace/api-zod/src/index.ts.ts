import { z } from "zod";

// ---------- Auth ----------

export const signupSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().max(30).optional(),
});
export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type LoginInput = z.infer<typeof loginSchema>;

// ---------- Menu ----------

export const menuCategorySchema = z.enum([
  "Starters",
  "Steaks",
  "Chicken",
  "Seafood",
  "Pasta",
  "Sandwiches",
  "Drinks",
]);

export const createMenuItemSchema = z.object({
  name: z.string().min(1).max(150),
  category: menuCategorySchema,
  description: z.string().max(2000).default(""),
  image: z.string().max(500).default(""),
  price: z.coerce.number().positive(),
  isAvailable: z.boolean().default(true),
});
export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>;

export const updateMenuItemSchema = createMenuItemSchema.partial();
export type UpdateMenuItemInput = z.infer<typeof updateMenuItemSchema>;

// ---------- Reservations ----------

export const reservationStatusSchema = z.enum([
  "pending",
  "confirmed",
  "cancelled",
]);

export const createReservationSchema = z.object({
  name: z.string().min(1).max(120),
  phone: z.string().min(1).max(30),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Expected HH:MM"),
  guests: z.coerce.number().int().min(1).max(50),
  request: z.string().max(1000).default(""),
});
export type CreateReservationInput = z.infer<typeof createReservationSchema>;

export const updateReservationStatusSchema = z.object({
  status: reservationStatusSchema,
});
export type UpdateReservationStatusInput = z.infer<
  typeof updateReservationStatusSchema
>;

// ---------- Orders ----------

export const orderStatusSchema = z.enum([
  "pending",
  "preparing",
  "ready",
  "completed",
  "cancelled",
]);

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        menuItemId: z.coerce.number().int().positive(),
        quantity: z.coerce.number().int().min(1).max(50),
      }),
    )
    .min(1),
});
export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const updateOrderStatusSchema = z.object({
  status: orderStatusSchema,
});
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
