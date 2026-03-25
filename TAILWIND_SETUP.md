# Tailwind CSS Build Setup

## Installation

1. Install dependencies:
```bash
npm install
```

## Building CSS for Production

Run this once before deploying to GitHub Pages:
```bash
npm run build:css
```

This generates `count/css/tailwind.css` with all your Tailwind classes compiled and minified. Commit this file to your repo.

## Development (Optional)

For live CSS recompilation while editing:
```bash
npm run dev
```

This watches your HTML files and recompiles CSS whenever Tailwind classes change.

## GitHub Pages Deployment

1. Build the CSS: `npm run build:css`
2. Commit `count/css/tailwind.css` to your repo
3. Push to your GitHub Pages branch
4. Your site will now work without the Tailwind CDN ✓

No build step is required on GitHub Pages—it will serve the pre-compiled CSS.

---

**Note:** The `count/css/app.css` and `count/css/shared.css` files contain custom extensions (`.glass-card`, `.neon-input`, etc.) that are still linked and used alongside the compiled Tailwind CSS.
