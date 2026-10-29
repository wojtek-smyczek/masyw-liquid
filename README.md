# MASYW

A custom Shopify theme for a design studio specializing in monolithic stainless steel furniture and objects.

![Product view 1](docs/01.png)
![Product view 2](docs/02.png)

## About the project

MASYW is a brand founded by a friend from southern Poland — a design studio crafting heavy, industrial furniture from stainless steel. I'm helping him build the online store, which presents their product catalog with detailed specifications, an image gallery, a cart and checkout. I also contributed to the overall visual design of the site.

The site started as a Next.js app and was converted 1:1 into a Shopify Liquid theme — same layout and Tailwind styles, with products, cart, checkout, contact form and SEO handled by Shopify. The Next.js version lives in git history (last commit before removal: `603d47f`).

### Key features

- **Fully editable in the Shopify theme editor** — texts, links, hero video, images and collections are section settings and blocks
- **Product pages** with image galleries, specs from metafields, variant picker and AJAX add to cart
- **Cart drawer** on the Shopify AJAX Cart API + Section Rendering API, with a no-JS `/cart` fallback
- **Contact form** using Shopify's native `{% form 'contact' %}` (spam protection included)
- **Lightweight vanilla JS** — small custom elements, no framework
- **Self-hosted Inter** variable font (no Google Fonts requests)

## Tech stack

| Category   | Technology                                                                                     |
| ---------- | ---------------------------------------------------------------------------------------------- |
| Templating | [Shopify Liquid](https://shopify.dev/docs/api/liquid) (Online Store 2.0, JSON templates)       |
| Styling    | [Tailwind CSS 4](https://tailwindcss.com/) compiled with `@tailwindcss/cli`                    |
| JavaScript | Vanilla JS custom elements                                                                     |
| Tooling    | [Shopify CLI](https://shopify.dev/docs/api/shopify-cli) (`theme dev`, `theme check`), Prettier |

## Project structure

```
masyw/
├── theme/                      # The Shopify theme (what gets uploaded)
│   ├── layout/theme.liquid     # Root layout — header group, main, footer group, cart drawer
│   ├── sections/
│   │   ├── header.liquid       # Navigation, mobile menu, cart link
│   │   ├── hero.liquid         # Background video with scrolling text
│   │   ├── description.liquid  # Homepage description
│   │   ├── featured-products.liquid
│   │   ├── main-product.liquid # Product page — gallery, specs, variants, add to cart
│   │   ├── cart-drawer.liquid  # Slide-in cart
│   │   ├── main-cart.liquid    # /cart page
│   │   ├── main-contact.liquid # Contact info + form
│   │   ├── main-about.liquid   # Brand story
│   │   ├── main-collection.liquid, main-page.liquid, main-404.liquid
│   │   └── footer.liquid       # Footer with scrolling marquee
│   ├── snippets/               # product-card, cart-contents
│   ├── templates/              # JSON templates (index, product, cart, page.contact, page.about, …)
│   ├── assets/                 # theme.css (generated), *.js, font, favicon
│   ├── locales/                # UI strings
│   └── src/tailwind.css        # Tailwind source → assets/theme.css (not uploaded)
├── media/                      # Source photos and videos to upload to Shopify
└── docs/                       # README screenshots
```

## Getting started

### Prerequisites

- Node.js 18+
- A Shopify store (a free development store from [Shopify Partners](https://partners.shopify.com) works)

### Installation

```bash
git clone https://github.com/wojtek-smyczek/masyw.git
cd masyw
npm install
```

### Development

Run in two terminals:

```bash
npm run theme:css                                              # rebuild CSS on change
npm run theme:dev -- --store <store>.myshopify.com --theme-editor-sync
```

Open [http://127.0.0.1:9292](http://127.0.0.1:9292).

### Before pushing

```bash
npm run theme:build   # minified CSS — assets/theme.css is committed
npm run theme:check   # Liquid linter
```

## Store setup

The theme expects a few things in the Shopify admin:

- **Product metafields** (Settings → Custom data → Products, single line text): `custom.materials`, `custom.dimensions`, `custom.delivery`
- **Pages**: `contact` (template `page.contact`) and `about` (template `page.about`, body = story text)
- **Home page collection** (handle `frontpage`) — products shown in the homepage grid
- **Money format** (Settings → General): `{{amount_no_decimals}} EUR` for prices like "100 EUR"
- Optional: tag a product `coming-soon` to blur it in the grid and disable purchase

## License

© MASYW. All rights reserved.
