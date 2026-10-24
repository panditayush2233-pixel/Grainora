# Grainora website — editable starter

## Run it
1. Unzip `Grainora-Website.zip`.
2. Open `index.html` in a browser to preview. For best results, upload the full folder to Netlify or another static website host.
3. Keep `assets/`, `index.html`, `style.css`, `script.js`, and `products.js` together.

## Edit product names, prices, pack sizes, photos, and descriptions
Open `products.js`. Every item is an object inside `PRODUCTS`.
- `name`: displayed product name
- `price`: number in rupees (currently ₹250 each)
- `pack`: displayed pack size (currently 200g pack)
- `image`: path to image inside `assets/`
- `category`: `sweets`, `seeds`, or `staples`
- `tag` and `description`: product label and short description

To add another product, copy one object in `PRODUCTS`, give it a unique `id`, change the fields, and add the product photo to `assets/`. The shop cards and cart update automatically from this file.

## WhatsApp number
Open `script.js` and change `WHATSAPP_NUMBER` to the number you want to receive orders. Use country code with no `+` or spaces. Current setting: `917309011129`.
The order message includes the customer's name, phone, address, products, quantities, and calculated subtotal.

## Contact information
Edit the footer text and phone/email in `index.html` if needed.

## Reviews note
The review cards are clearly labeled as preview/design feedback, not verified customer reviews. Replace them with real customer-approved reviews before publishing as customer testimonials.

## Before launch
- All products currently show ₹250 and 200g, as requested. Confirm whether multigrain atta should instead be sold in a larger pack before accepting real orders.
- Confirm actual ingredients, allergen statements, net weight, shelf life, FSSAI/licensing and any nutrition/health claims before publishing packaging or product claims.
- Delivery fee is not calculated by the site; the total shown is the product subtotal and delivery is confirmed on WhatsApp.
- This is a static front-end site; orders are sent to WhatsApp, not stored in an online admin dashboard.
