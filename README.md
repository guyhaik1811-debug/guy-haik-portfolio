# Guy Haik Portfolio

A static portfolio for Guy Haik, ready to deploy on GitHub Pages.

## Set up Guy's links

Open `scripts/config.js` and add the public values for `email`, `linkedin`, and (optionally) YouTube.

### Questions

The question form is closed. `booking.html` shows a short notice.

## Local preview

```bash
npm install
npm run build:posts
python3 -m http.server 8000
```

## Deploy to GitHub Pages

The included GitHub Actions workflow deploys pushes to `main`. After creating the repository, push the project, then select **GitHub Actions** under **Settings → Pages**. If TinaCMS is wanted for publishing notes, connect the new repository in TinaCloud and add `TINA_PUBLIC_CLIENT_ID` and `TINA_TOKEN` as GitHub repository secrets.