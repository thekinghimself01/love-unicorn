This folder contains the single-page "Will you be my Valentine?" site ready for static hosting.

How to preview locally

1. From PowerShell, serve the folder (Python recommended):

```powershell
# from c:\Users\User1\Documents\Work\bemyvalentine
python -m http.server 8000; Start-Process "http://localhost:8000/index.html"
```

2. Or open `index.html` directly in your browser.

Deploying to Netlify

1. Connect your repository to Netlify and set the publish directory to `bemyvalentine` (or drag the `bemyvalentine` folder to the Netlify Deploy UI).
2. This repo contains `netlify.toml` which sets the publish directory to `bemyvalentine`.
3. The site already uses a lightweight SVG favicon (`favicon.svg`).

Notes

- Styles are in `styles.css` and script in `script.js`.
- Images are local in `images/`.
- If you want deterministic gallery images instead of random, edit `script.js` and replace the random selection with a fixed array order.