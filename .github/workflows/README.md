# Workflows

| File | Trigger | Purpose |
| --- | --- | --- |
| `quality.yml` | Every push to a non-`main` branch, and every pull request | Typecheck → lint → server build → static export. Fails the PR if any step breaks. |
| `deploy.yml` | Push to `main`, manual dispatch, and a nightly cron | Builds the static export and publishes it to GitHub Pages. |

## One-time setup for Pages

The workflow can build and upload the site on its own, but **Pages itself has to
be switched on once by a repo admin** — the Actions token is not allowed to
create the site.

1. Repository → **Settings** → **Pages**
2. **Build and deployment → Source** → choose **GitHub Actions**
3. Push to `main` (or run the *Deploy site* workflow manually).

The site then appears at `https://<owner>.github.io/<repo>/`.

### Optional variables

Set these under **Settings → Secrets and variables → Actions → Variables**:

| Name | Effect |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Overrides the canonical origin used in metadata, sitemap, RSS and the résumé (e.g. `https://arifrahman.dev`). |
| `GITHUB_USERNAME` | Account whose contribution graph is displayed. |

And under **Secrets**:

| Name | Effect |
| --- | --- |
| `GH_ACTIVITY_TOKEN` | GitHub token used at build time to render a real contribution graph. Without it the graph is clearly labelled sample data. |

## Static export limits

GitHub Pages serves static files only, so:

- `POST /api/contact` does not exist. The contact form opens a prefilled email
  instead (the same endpoint behaves normally on Vercel).
- The résumé is the build-time `public/resume.pdf`.
- GitHub activity is refreshed by the nightly cron rebuild.
