# @workspace/db — Phase 1

Ye package tumhare repo ke root mein `packages/db/` (ya jahan bhi `@workspace/*`
packages rakhna chahte ho) mein daalni hai — kyunki `api-server/package.json`
pehle se `@workspace/db: workspace:*` ko dependency maan raha hai.

## Steps

1. **Free Postgres database lo** — sabse aasan raasta Neon
   (https://neon.tech) hai, free tier deta hai aur `DATABASE_URL` seedha mil
   jaata hai. (Replit khud bhi ek Postgres database button deta hai agar
   Replit par hi kaam kar rahe ho.)

2. Is folder ko apne repo mein `packages/db/` par copy karo.

3. Root mein agar `pnpm-workspace.yaml` nahi hai, wo banao:
   ```yaml
   packages:
     - "packages/*"
     - "api-server"
     - "rosati-bistro"
   ```

4. `.env` file (root ya `packages/db/`) mein:
   ```
   DATABASE_URL=postgres://user:password@host/dbname
   ```

5. Install + migrate + seed:
   ```bash
   pnpm install
   pnpm --filter @workspace/db db:generate   # migration files banata hai
   pnpm --filter @workspace/db db:migrate    # DB par apply karta hai
   pnpm --filter @workspace/db db:seed       # admin user + starter menu daalta hai
   ```

6. Seed ke baad admin login:
   - email: `admin@rosatibistro.com`
   - password: `ChangeMe123!` (Phase 2 mein login bante hi turant change kar
     lena — abhi ye sirf placeholder hai)

## Kya schema banaya (`src/schema.ts`)

| Table | Kaam |
|---|---|
| `users` | Client + Admin dono isi table mein, `role` column se differentiate |
| `menu_items` | Har dish — category, price, availability |
| `reservations` | Table booking — guest bhi kar sakta hai (login zaroori nahi), `status` se admin approve/cancel karega |
| `orders` + `order_items` | Client dashboard ki "order history" feature ke liye — ek order ke andar multiple dishes |

## Phase 2 Preview

Agla phase (`api-server`) mein hum ye routes banayenge jo isi schema ko use
karenge: `/api/auth/*`, `/api/menu`, `/api/reservations`, `/api/orders`.
