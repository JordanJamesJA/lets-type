# Let's Type.

**Your keyboard, your experience.**

Let's Type is a mechanical-keyboard storefront and interactive 3D product experience, developed as an Intellibus Academy project. The application combines a responsive product catalog, keyboard builder, account authentication, and shopping cart.

> **Current scope:** This is a demonstration application, not a live store. Product browsing, interactive 3D previews, authentication, and client-side cart management are implemented. **Stripe checkout and payment processing are not implemented.** Order history and support submissions are not connected to production services.

## Start here: new contributors

If you're joining the codebase, this is the recommended reading order:

1. Read **What the application does** and **Project structure** below.
2. Follow **Local setup** and run the app.
3. Open `app/page.tsx` to see how a route is rendered; open `app/layout.tsx` to understand shared page structure.
4. Open `lib/products.ts` and follow one product into the shop UI and `/shop/[id]` route.
5. Read `store/cart-store.ts`, then find where shop components call `addItem` and where the cart reads `items`.
6. Read `lib/auth.ts`, `lib/auth-client.ts`, and `lib/db/schema.ts` before editing authentication or database code.
7. Follow **Make your first change** and **Before opening a pull request**.

You do **not** need to understand Three.js or authentication internals to start contributing to styling, content, product catalog presentation, and ordinary React components. Work on those areas first if you're new to the stack.

## Tech stack

| Concern | Technology | Why it is here |
| --- | --- | --- |
| Framework | Next.js App Router, React | File-based routes, layouts, and UI components |
| Language | TypeScript | Typed props, product objects, and safer changes |
| Styling | Tailwind CSS | Responsive utility classes and reusable visual patterns |
| 3D rendering | Three.js, React Three Fiber, Drei | Interactive keyboard and product-part models |
| Authentication | Better Auth | Sign-up, login, sessions, and account updates |
| Persistence | PostgreSQL (Neon), Drizzle ORM | Database access and auth-related tables |
| Shopping-cart state | Zustand | Shared client-side cart data, persisted in browser storage |
| Icons | Lucide React | Consistent UI icons |

## What the application does

**Home:** A premium landing page with rotating visual themes and an interactive exploded keyboard model.

**Shop:** Browsable product cards with category filtering, sorting, grid/list views, Quick View, and individual product pages at `/shop/[id]`. Product-specific 3D previews are composed from reusable models.

**Build:** A keyboard configuration interface that lets visitors select options and see pricing changes. Not all selections are reflected in the 3D geometry yet.

**Cart:** Visitors can add products, change quantities, remove products, and view a subtotal. Cart contents survive a page refresh in the same browser.

**Account:** Visitors can sign up, log in, maintain a session, sign out, and update supported profile information. The displayed orders area is not a persisted order history.

**Collections / About / Support:** Supporting storefront content. Support forms and feedback interfaces are demonstration-only.

## Project structure and responsibilities

The following is a **conceptual map** of the important locations; check the actual repository tree for all filenames and routes.

```text
lets-type/
├── app/
│   ├── layout.tsx                    Shared app layout and metadata
│   ├── page.tsx                      Homepage
│   ├── globals.css                   Global styles
│   ├── components/
│   │   ├── keyboard-3d.tsx           Exploded keyboard and reusable 3D parts
│   │   ├── navbar.tsx                Site-wide navigation
│   │   └── shop/
│   │       ├── product-card.tsx      Shop product presentation
│   │       ├── product-3d-preview.tsx  Product-category 3D previews
│   │       └── ...                   Quick View and other shop components
│   ├── shop/
│   │   ├── page.tsx                  Shop listing and interactions
│   │   └── [id]/                     Dynamic product route and details UI
│   ├── build/                        Keyboard configurator
│   ├── cart/                         Cart page
│   ├── about/                        About page
│   ├── collections/                  Collections page
│   ├── support/                      Support and FAQs
│   └── api/auth/[...all]/route.ts     Better Auth API handler
├── lib/
│   ├── products.ts                   Catalog items and Product types
│   ├── auth.ts                       Server-side Better Auth setup
│   ├── auth-client.ts                Browser auth client
│   └── db/
│       ├── index.ts                  Database connection
│       └── schema.ts                 Database tables/schema
├── store/
│   └── cart-store.ts                 Shared, persistent cart state
├── public/                           Static assets
└── package.json                      Dependencies and scripts
```

**Where should I edit?** For copy or page layout, start with the matching route in `app/`. For product metadata, use `lib/products.ts`. For reusable shop visuals, use `app/components/shop/`. For cart behavior, use `store/cart-store.ts`. For login/session behavior, use the Better Auth files in `lib/`. Avoid changing database or auth files casually: they affect every account.

## Local setup

### Prerequisites

- Node.js 22 or newer (the project was developed on Node.js 22.20.0)
- npm
- Access to a PostgreSQL database (Neon was used during development)

### 1. Get the project

```bash
git clone <REPOSITORY_URL>
cd lets-type
npm install
```

Replace `<REPOSITORY_URL>` with the repository URL once it is shared with you.

### 2. Configure environment variables

Create `.env.local` in the **project root** (next to `package.json`):

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
BETTER_AUTH_SECRET="REPLACE_WITH_A_LONG_RANDOM_SECRET"
BETTER_AUTH_URL="http://localhost:3000"
```

| Variable | Used for |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection for Drizzle and authentication |
| `BETTER_AUTH_SECRET` | Secret used by Better Auth for security-sensitive operations |
| `BETTER_AUTH_URL` | Base URL of this running instance, such as the local development origin |

Obtain real credentials privately from the project maintainer, or use your own development database. **Never commit `.env.local`, paste secrets into issues, or expose server credentials in client components.** A `NEXT_PUBLIC_` prefix exposes a value to the browser; do not put secrets behind that prefix.

### 3. Prepare the database

Auth requires the tables defined in `lib/db/schema.ts`. Inspect `package.json` and the Drizzle configuration for the project's actual migration/push command. Apply the configured schema to your **development** database before testing signup or login. Do not apply schema changes to another contributor's database without coordination.

The exact database command has intentionally not been hardcoded here because it has not yet been verified against the repository scripts.

### 4. Run the app

```bash
npm run dev
```

Open **http://localhost:3000**. Test the homepage and shop first; then verify signup/login after database configuration.

### 5. Verify a production build

```bash
npm run build
```

Refer to `package.json` for additional available scripts (such as linting or database tasks); don't assume an npm script exists without checking.

## How the code works

### Next.js routes versus reusable components

The App Router turns folders containing `page.tsx` into routes: for example, `app/shop/page.tsx` serves `/shop`, and the `[id]` folder handles product-specific URLs. `app/layout.tsx` wraps shared UI around routes.

Interactive components that use browser state, event handlers, or browser APIs are marked with `"use client"`. Server-rendered route files can load or select data and pass plain, serializable props to client components. Keep secrets and server database access out of client components.

### Product data flow

```text
lib/products.ts
     │ Product objects, IDs, prices, categories, stock
     ├──> /shop listing ──> ProductCard ──> Quick View
     │                           │
     │                           └──> /shop/[id] details
     └──> 3D previews selected by product category / ID
```

The catalog is currently defined in code, not retrieved from an inventory API. Treat `stock` and `price` as demo catalog values. Use a stable, unique product `id`, because routes and cart entries depend on it.

### Cart data flow

```text
ProductCard / Quick View / Product Details
                 │ addItem(product, quantity)
                 ▼
        store/cart-store.ts (Zustand)
                 │
       ┌─────────┴─────────┐
       ▼                   ▼
  Cart page          Browser storage
  reads items        retains cart locally
```

The cart uses a shared Zustand store. To add an item, call its `addItem` action; to change a quantity, use `updateQuantity`; to remove one, use `removeItem`. The store enforces product-stock limits. Because persistence is browser-local, items are not synchronized between devices, accounts, or sessions in different browsers.

### 3D rendering

`app/components/keyboard-3d.tsx` builds the homepage's exploded keyboard out of reusable geometry: `Keycap`, `MechanicalSwitch`, `MountingPlate`, `PCB`, and `KeyboardCase`. `app/components/shop/product-3d-preview.tsx` reuses these parts to show different product categories and colors.

These are **live WebGL scenes**, not product photographs. A 3D `<Canvas>` needs a container with a real width and height. If a preview appears tiny or in a corner, inspect the surrounding element's sizing and positioning *before* changing camera settings. Be mindful of performance: rendering many canvases at once can be expensive on mobile devices.

### Authentication and database

```text
Signup / Login / Account UI
           │
           ▼
     lib/auth-client.ts
           │ HTTP requests / session operations
           ▼
 app/api/auth/[...all]/route.ts
           │
           ▼
       lib/auth.ts
           │
           ▼
      Drizzle / PostgreSQL
```

Better Auth manages credentials and sessions. `lib/auth.ts` is the server configuration; `lib/auth-client.ts` is the client interface. The Drizzle schema and database connection are in `lib/db/`. When adding protected functionality, validate authentication and authorization **on the server**, not only by hiding buttons in the UI.

## Make your first change

**Example A — Update a product description**

1. Open `lib/products.ts` and find the product by `id`.
2. Change its description without changing its ID or the `Product` type.
3. Run the app, open `/shop`, and check its card, Quick View, and detail page.
4. Check mobile layout and run `npm run build`.

**Example B — Improve a shop component**

1. Find the relevant component under `app/components/shop/`.
2. Identify its props (`product`, callbacks, and optional display settings).
3. Keep navigation separate from cart button events so clicking one action doesn't trigger another.
4. Check grid/list display, keyboard accessibility, and responsive behavior.
5. Run `npm run build`.

**Example C — Add a new catalog product**

1. Add a typed `Product` entry in `lib/products.ts`, following the existing structure and category names.
2. Give it a unique URL-safe ID, category, name, description, price, and stock value.
3. Check how the shop, detail route, 3D preview, and cart handle it. New IDs may require checking `generateStaticParams` in the dynamic product route.
4. If you add a new category, update the category-dependent displays and 3D fallbacks as needed.

## Contribution guidelines

- Prefer small, focused changes over rewriting whole pages.
- Keep TypeScript types accurate. Avoid `any` when you can express a concrete type.
- Use existing Tailwind patterns and the current premium visual system rather than introducing a competing style.
- Make interactive elements accessible: use buttons for actions, links for navigation, labels for inputs, and visible keyboard focus states.
- Account for mobile widths, touch interaction, loading states, and empty/error states.
- Do not mix server credentials, database calls, or secrets into `"use client"` files.
- If changing shared types or a Zustand action, search for every caller before changing its contract.
- Explain non-obvious business logic, **why** it exists, and any trade-offs in comments or a pull request; avoid comments that merely repeat the code.

### Before opening a pull request

- [ ] Explain what changed and why, with screenshots for visual changes.
- [ ] Test the affected user flow in the browser.
- [ ] Check mobile and desktop presentation.
- [ ] Ensure existing cart and navigation actions still work.
- [ ] Run `npm run build` and fix TypeScript/build errors.
- [ ] Confirm no `.env.local`, API keys, passwords, or other secrets were added.
- [ ] Update this README if you change setup steps, architecture, or supported behavior.

## Manual acceptance checklist

- [ ] Home page renders and 3D keyboard interaction works.
- [ ] Main navigation is usable on desktop and mobile.
- [ ] Product filtering, sorting, and grid/list controls work.
- [ ] Quick View opens, closes, and displays its 3D model.
- [ ] Product links resolve to the correct `/shop/[id]` route.
- [ ] Details-page 3D preview fills its display area appropriately.
- [ ] Add to Cart, quantity controls, removal, and subtotal updates work.
- [ ] Cart survives refresh in the same browser.
- [ ] Builder selections update displayed values and computed price.
- [ ] Signup, login, session persistence, sign-out, and profile editing work with the configured database.
- [ ] Support and order-history placeholders are not mistaken for live services.
- [ ] `npm run build` passes.

## Known limitations and safe extension points

| Area | Current limitation | Suggested direction |
| --- | --- | --- |
| Checkout | No Stripe integration or real payments | Add a server-side checkout flow and verified payment webhooks |
| Orders | No persisted order history | Introduce database-backed orders and authenticated order views |
| Inventory | Demo values in catalog code | Add server-controlled stock and inventory checks |
| Cart | Browser-local state only | Optional authenticated server-side cart synchronization |
| Support | Contact/feedback UI is demonstration-only | Add validated server-side submission and delivery |
| Builder | Not every selected option changes the model | Connect configuration to matching geometry/material variants |
| Product previews | Shared modeled geometry, not product-exact assets | Add distinct models or assets where accuracy matters |

These are extension ideas, **not shipped features**. In particular, never treat a client-provided cart total as an authoritative payment amount; future checkout logic must obtain prices on the server.

---

*Built for the Intellibus Academy project demonstration. This README is intended to help a junior developer get the project running, understand its main data flows, and contribute safely.*
