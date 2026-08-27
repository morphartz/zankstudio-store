# ZANK STUDIO Supabase setup

The application expects the normal Supabase project URL and publishable key:

- `NEXT_PUBLIC_SUPABASE_URL=https://dhaxwbecgdgdqrnhubwb.supabase.co`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable key from the same project>`

## One-time database setup

1. Open the ZANK STUDIO project in Supabase.
2. Open **SQL Editor**.
3. Create a new query.
4. Open `supabase/schema.sql` from this repository and paste the entire file into the SQL editor.
5. Click **Run**.
6. Open **Authentication → Users** and create/confirm `a.g.b.morphzy@gmail.com` with the admin password you want to use.
7. The SQL creates the `product-images` public storage bucket, RLS policies, products, orders, order items, store settings, and DHD delivery rates.
8. After the SQL finishes, redeploy Netlify so the production site uses the current GitHub `main` commit.

## Admin

`/admin/login` uses Supabase email/password authentication. The admin email is `a.g.b.morphzy@gmail.com`.

## Product images

Admin product creation and editing upload images directly to the Supabase Storage bucket `product-images`. Images are limited to 8 MB each. Multiple images are supported.
