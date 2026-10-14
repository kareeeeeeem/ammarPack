# Ammar Pack Website

English-language website for **Ammar Pack**, a cardboard carton and packaging manufacturer in Banha, Egypt. The site presents packaging concepts, product planning tools, a quotation builder, and contact options. It is built as a static export and does not require an application server or database.

This project is adapted from [rohit96/export-website-template](https://github.com/rohit96/export-website-template). The original Git history is retained.

## Technology and requirements

- Next.js 14, React 18, TypeScript, Tailwind CSS 3, Framer Motion, and Lucide React.
- Node.js 20 or later and npm for local development and builds.
- A Cloudflare account with access to the existing Pages project is needed only for deployment.

## Install and run locally

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Production build and static export

```bash
npx tsc --noEmit
npm test
npm run build
npm run check:static
```

`next.config.js` sets `output: 'export'`. `npm run build` generates the static site in `out/`; `npm run check:static` verifies exported pages, local links, and assets. The build does not require a server API or an external font download. The `out/` directory is generated and should not be committed.

## Project structure

| Path | Purpose |
| --- | --- |
| `src/app/` | Pages, root layout, and homepage styles |
| `src/components/` | Shared UI, quotation tools, and homepage motion |
| `src/lib/content.ts` | Product, industry, and article content |
| `src/lib/quote.ts`, `src/lib/whatsapp.ts` | Quotation validation and WhatsApp messages |
| `public/` | Images, illustrations, icons, sitemap, and robots file |
| `site.config.ts` | Business identity and contact information |
| `test/` | Interactive flow and static export checks |
| `next.config.js`, `tailwind.config.js`, `postcss.config.js`, `tsconfig.json` | Build and styling configuration |

## Configuration and content

Update the company name, domain, contact details, and WhatsApp number in `site.config.ts`. Review SEO metadata in `src/app/layout.tsx`, plus `public/sitemap.xml` and `public/robots.txt`, if the domain changes. Update product names, descriptions, applications, and image paths in `src/lib/content.ts`; keep the matching assets in `public/images/products/`. Product detail pages are generated from that content at build time. Edit the homepage in `src/app/page.tsx` and its dedicated motion and styles in `src/components/HomeMotion.tsx` and `src/app/home.module.css`.

Replace temporary brand and packaging imagery only with assets approved for publication. Put optimized images in `public/images/` and update the paths in the relevant content or page component. The supplied originals remain in local `src/media/`, which is excluded from Git; the optimized factory WebP images in `public/images/factory/` and the short, muted H.264 clip in `public/media/` are the published versions. The clip has a poster, controls, and no automatic loading or playback. Confirm publication rights for supplied media before wider distribution. The older `public/images/ammar-factory-official.jpg` came from Ammar Pack's public gallery; its reuse rights should also be confirmed.

## Interactive tools and WhatsApp quotations

- `/quote` builds a packaging brief with dimensions, quantity, print needs, delivery city, and a review step. It opens a prepared WhatsApp or email message; the visitor sends it manually.
- `/products` has client-side search, application filters, a three-product comparison, and a short product finder. Each product has a static detail page.
- `/dimensions` shows a lightweight box diagram and transfers the entered measurements into `/quote` through the URL.
- Contextual WhatsApp links cover general, product, custom packaging, quotation, factory visit, consultation, and minimum-order questions. Change the destination number in `site.config.ts` and message templates in `src/lib/whatsapp.ts`. The quote builder uses `src/lib/quote.ts` to prepare a structured message; opening WhatsApp does not send it automatically.
- The homepage's PACKY mascot is procedural Three.js geometry in `src/components/packy/`. One persistent canvas follows scroll-linked waypoints through the hero, box story, products, process, factory photograph, and quote sections. It pauses when the page is hidden or the journey ends, and shows an illustrated, nonmoving fallback for reduced motion or unavailable WebGL. Visitors can click or tap it for reactions; no sound or external 3D asset is loaded.

## Inquiry form

The old template's Web3Forms key was removed. Set `NEXT_PUBLIC_WEB3FORMS_KEY` to a **new Ammar Pack-owned public access key** at build time to enable online submissions. Until then, the contact form opens prepared email or WhatsApp drafts using the entered details. A successful submission is shown only after Web3Forms returns success. Do not put private credentials in this variable.

## Content and asset review

The official [Ammar Pack website](https://www.ammarpack.com/) confirms the company name, slogan, factory location, phone, email, working hours, and general carton manufacturing/printing description. It does not publish capacity, certifications, precise product specifications, or minimum orders, so those claims are intentionally absent. The product and industry sections are illustrative inquiry categories and must be confirmed against Ammar Pack's actual offerings.

Temporary content requiring replacement or approval:

- `public/images/products/*studio.jpg` and `public/images/heroes/packaging-studio.jpg`: generated generic packaging studio photos, not photographs of Ammar Pack products or operations.
- `public/images/products/*.svg` and `public/images/heroes/*.svg`: locally created packaging illustrations for editorial sections.
- `public/logo.png`, favicon files, and the `Logo` component: temporary wordmark and icon pending the official vector brand files.
- `public/og-image.jpg`: temporary social preview graphic.
- `public/images/ammar-factory-official.jpg`: older 400×300 px image from Ammar Pack's public gallery, no longer used on the homepage.
- Product descriptions, applications, and industry examples: editorial drafts for quotation conversations, subject to factory confirmation.

Missing business information: official logo and brand guide, rights confirmation for supplied factory media, verified category-specific product photography, detailed product and board specifications, printing/finishing options, any certifications, production and lead-time information, quotation terms, and an Ammar Pack-owned Web3Forms key. None is assumed on the website.

## Security status

`npm audit fix` was run without `--force` and updated compatible dependencies. Before adding Wrangler, the audit reported 9 remaining findings (2 moderate, 6 high, 1 critical) in the existing Next.js and Tailwind dependency trees. With the Node 20-compatible Wrangler 3 deployment CLI installed as a development dependency, the audit reports 16 (4 moderate, 11 high, 1 critical). The additional findings are in development tooling, not the static site uploaded to Pages. Suggested fixes include major upgrades and should be handled in a separately tested dependency migration. The deployed static site does not run the Next.js server or image optimizer.

## Cloudflare Pages deployment

The production branch is `main` and the existing Pages project is named `ammar-pack`. Authenticate Wrangler with the Cloudflare account that owns that project. To publish a future update, commit and push the source to GitHub, then build and deploy the static output without changing DNS:

```bash
npm ci
npx tsc --noEmit
npm test
npm run build
npm run check:static
npx wrangler pages deploy out --project-name ammar-pack --branch main
```

For source-only updates, run `git add -A`, `git commit -m "Describe the update"`, and `git push ammar-pack main` after reviewing the staged files. A GitHub push does not automatically deploy a direct-upload Pages project unless a separate Git integration has been configured.

## License and attribution

The [original template README](https://github.com/rohit96/export-website-template) states that the template is **MIT-licensed**. That attribution is preserved here. The original repository does not include a separate license file or copyright notice; no new ownership claim is made for the template or third-party media. Confirm usage rights for factory and other third-party assets independently.
# ammarPack
