# Zank Studio Store

Monochrome personalized T-shirt storefront for Algeria, with COD checkout and an admin control surface.

## Current routes

- `/` storefront
- `/products/[id]` product + personalization
- `/cart` cart
- `/checkout` COD checkout
- `/admin` store dashboard

## Store details

Phone / WhatsApp: 0798 46 06 04  
Instagram: @zankstudio  
Business: Algiers / Oran

## Production architecture

The current UI is intentionally deployable as a clean frontend prototype. Before accepting real customer orders, connect persistent product/order storage, protected admin authentication, image storage, and the final DHD rate table through environment variables and a production database.
