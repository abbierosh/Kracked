# Kracked

KRackedbakes flavour finder quiz.

Live site: https://kracked.pages.dev/

This is a lightweight customer-facing quiz for KRackedbakes, a real dessert business selling through our home-based bakery. Instead of sending shoppers straight into a product list, the quiz turns browsing into a guided recommendation flow: customers answer a few preference questions, get matched to a bake, then click through to the matching product page on Take App.

https://www.instagram.com/krackedbakes/
https://take.app/krackedbakes

## Why This Exists

Small food businesses often sell through simple storefronts where discovery depends on the customer already knowing what they want. This quiz adds a product discovery layer without requiring a custom ecommerce backend.

It connects:

- a branded front-end experience hosted on Cloudflare Pages
- quiz logic that maps customer preferences to products
- real purchase paths through Take App product links
- a shareable URL that can be used from Instagram, WhatsApp, TikTok, or a bio link

## What It Demonstrates

- Building a polished static web experience with HTML, CSS, and JavaScript
- Turning product data and customer preferences into a guided recommendation journey
- Connecting a custom landing experience to an existing commerce platform
- Designing for a real business constraint: improve product discovery without rebuilding checkout
- Shipping a deployable site that can be used by customers immediately

## Business Flow

1. Customer opens the quiz at https://kracked.pages.dev/
2. They answer questions about flavour, texture, mood, and gifting intent.
3. The quiz recommends a KRackedbakes product.
4. The result links directly to the relevant Take App product page for purchase.

## Tech

- Static HTML, CSS, and JavaScript
- Cloudflare Pages hosting
- Take App product links
- No build step or backend required

## Run Locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/`.
