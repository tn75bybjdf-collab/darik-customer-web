DARIK CUSTOMER WEB — L197

Goal:
Launch getdarik.com as the browser version of the Darik Customer App.

Folder:
C:\Users\HP\Desktop\darik-customer-web

What this first web version includes:
- Next.js browser storefront
- Supabase Auth login/signup
- Customer profile creation in customers table
- Live products from products table
- Categories from categories table
- Retailers from retailers table
- Official product photo / thumbnail / raw fallback
- Size selection from product_variants when has_size_variants is true
- Persistent browser cart
- Cash checkout
- Free Next-Day Delivery over 10 JOD
- Express Delivery under 2 hours for 2 JOD
- Browser geolocation delivery-radius protection
- Inserts orders and order_items into the same tables as the Customer App
- Decrements product stock / product variant stock

Required .env.local:
NEXT_PUBLIC_SUPABASE_URL=your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=your Supabase anon key

Deploy plan:
1. Create new GitHub repo: darik-customer-web
2. Push this folder
3. Import into Vercel
4. Add the same env vars as customer/admin apps
5. Point getdarik.com to this Vercel project

Important:
This is not replacing the mobile Customer App. It is a new web storefront connected to the same Supabase database.
