import bcrypt from "bcryptjs";
import { db, users, menuItems } from "./index";

async function seed() {
  console.log("Seeding database...");

  // 1. Admin account — change this email/password after first login.
  const adminPasswordHash = await bcrypt.hash("ChangeMe123!", 10);
  await db
    .insert(users)
    .values({
      name: "Rosati Admin",
      email: "admin@rosatibistro.com",
      passwordHash: adminPasswordHash,
      role: "admin",
    })
    .onConflictDoNothing();

  // 2. A starter menu, matching what's currently hardcoded in the frontend.
  await db
    .insert(menuItems)
    .values([
      {
        name: "Bistro House Special Steak",
        category: "Steaks",
        description: "A generous cut, finished the Rosati way.",
        image: "/images/tagliatelle.jpg",
        price: "2200",
      },
      {
        name: "Dynamite Prawns",
        category: "Starters",
        description: "Crisp prawns, a lively house dressing.",
        image: "/images/burrata.jpg",
        price: "1400",
      },
      {
        name: "Chicken Lasagna",
        category: "Pasta",
        description: "Comfort in slow-baked layers.",
        image: "/images/tagliatelle.jpg",
        price: "1600",
      },
    ])
    .onConflictDoNothing();

  console.log("Seed complete. Admin login: admin@rosatibistro.com / ChangeMe123!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
