# Embed Instructions

## Option 1: Embed as an iFrame (Easiest)

Drop this into any page on your website:

```html
<iframe 
    src="/bulk-calculator/embed.html" 
    width="100%" 
    height="700" 
    style="border: none; border-radius: 8px;"
    title="Bulk Material Calculator">
</iframe>
```

**Adjust height** based on your needs (700px is a good default).

---

## Option 2: Copy the Widget Code

Copy the entire `embed.html` file content and paste directly into your page template. The calculator is completely self-contained with:
- All styles scoped to `.sbf-calculator` (won't conflict with your site's CSS)
- All JavaScript isolated in its own scope
- No external dependencies

---

## Option 3: Host on Your Server

Upload `embed.html` to your website and link to it from any page via iframe or direct link.

---

## Customization

The widget uses CSS custom properties you can override:

```css
.sbf-calculator {
    --primary-green: #2d5016;
    --accent-green: #5a8f3a;
    --light-green: #d4e8d4;
    --warm-brown: #8b6f47;
    /* ... change any of these */
}
```

All element classes start with `.sbf-` to avoid style conflicts.

---

## Features

✅ Fully self-contained (no external dependencies)  
✅ Responsive (works on mobile & desktop)  
✅ Scoped CSS (won't break your site styling)  
✅ Works in iframes  
✅ Accessible form controls  
✅ Links directly to order page  

---

## File Structure

- **`embed.html`** — Use this for embedding (complete widget with inline styles)
- **`EMBED.md`** — Integration instructions for iframe or direct embed
