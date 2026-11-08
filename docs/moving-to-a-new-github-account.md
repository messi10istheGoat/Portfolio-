# Moving this repo to a different GitHub account

A step-by-step for transferring `messi10istheGoat/Portfolio-` to a new owner
without breaking the site, the deploy pipeline, or existing links.

The good news up front: **the code is already owner-agnostic.** The deploy
workflow derives the owner, repo name, Pages origin and base path from
`github.repository_owner` / `github.event.repository.name` at build time. There
is no hardcoded `<owner>.github.io/<repo>` anywhere in the build path. Most of a
transfer "just works" — the parts that need your hands are the GitHub *settings*
that don't travel, and one file.

---

## 0. Decide which move you want

| You want | Do this | Old URL |
| --- | --- | --- |
| Same project, new owner | **Transfer** (recommended) | git/web redirect (Pages does **not**) |
| Start clean history under a new account | **Mirror push** to a new empty repo | no redirect |

Transfer is almost always right: issues, PRs, stars, watchers, secrets, webhooks
and deploy keys all come with it, and `git clone`/`fetch`/`push` against the old
URL keep working via redirect. A mirror push gives you a fresh repo with the
same commits but loses the issue/PR history and gives no redirect at all.

---

## 1. Before you touch anything

**Freeze the repo.** Merge or close open PRs, and stop pushing. A transfer while
Actions are mid-run can leave a workflow half-finished.

**Note the settings that will NOT transfer.** These live on the repo but are
tied to the old owner's context; re-create them afterwards:

- [ ] GitHub Pages: is it enabled, and what is the source? (`Settings → Pages`)
- [ ] Repo variables: `NEXT_PUBLIC_SITE_URL`, `GITHUB_USERNAME`
- [ ] Repo secrets: `GH_ACTIVITY_TOKEN`
- [ ] Branch protection / rulesets on `main`
- [ ] Custom domain, if any (remove it before transferring — a leftover `CNAME`
      on a private repo can be taken over by someone else)

**Collect the current values** so you can restore them:

```bash
gh api repos/OWNER/REPO/pages
gh api repos/OWNER/REPO/actions/variables   # needs admin
gh api repos/OWNER/REPO/actions/secrets     # names only, needs admin
```

---

## 2. Do the transfer

The receiving account must not already have a repo with the same name.

1. Repo → **Settings** → scroll to **Danger Zone** → **Transfer**
2. Enter the new owner (username or org name).
3. Optionally rename the repo here — this is the free moment to drop the
   trailing dash in `Portfolio-`.
4. Type the repo name to confirm.
5. The new owner gets an email and must **accept within one day** or the
   invitation expires.

You keep admin access as a collaborator afterwards.

---

## 3. Re-enable Pages (the one thing that really breaks)

GitHub does **not** redirect Pages sites. The moment the transfer completes,
`https://messi10isthegoat.github.io/Portfolio-/` stops serving. Expect a short
window where the site is down — do the transfer when that's acceptable.

In the new repo:

- **Settings → Pages → Build and deployment → Source: GitHub Actions**
- The `github-pages` environment is created by the workflow on first deploy.

Then trigger a deploy:

```bash
gh workflow run deploy.yml --repo NEW_OWNER/NEW_REPO
gh run watch --repo NEW_OWNER/NEW_REPO
```

The site comes up at:

- `https://<new-owner>.github.io/<new-repo>/` for a project site (the common case)
- `https://<new-owner>.github.io/` if you named the repo `<new-owner>.github.io`

The workflow handles both — it sets `basePath` to empty for a user-site repo and
to `/<repo>` otherwise. Verified by replaying its URL logic for each shape.

### If Pages refuses to enable

The one real blocker is account tier. On GitHub Free, Pages is **not available
for private repos**. If the new account is Free and the repo is private, either
make the repo public or upgrade. (The old repo was public, so this only bites if
you change visibility at the same time.)

---

## 4. Restore the settings

In the new repo, re-create what step 1 listed:

**Variables** (`Settings → Secrets and variables → Actions → Variables`)

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | *leave unset* unless you use a custom domain — the workflow derives the Pages URL itself |
| `GITHUB_USERNAME` | `rihadev` (the account whose contributions are shown) |

**Secrets**

| Name | Value |
| --- | --- |
| `GH_ACTIVITY_TOKEN` | a fine-grained token with read access to public profile data |

**Branch protection on `main`** — require a PR and the `Typecheck · lint · build`
check. This is still outstanding on the current account; do it here instead.

**Actions → General → Workflow permissions** — enable *Read and write* only if
you add a workflow that needs to push. The current two workflows need read +
`pages: write` + `id-token: write`, which are declared in `deploy.yml` itself.

---

## 5. The single file you must edit

`src/lib/site.ts` line 30 is the only hardcoded production URL:

```ts
return "https://messi10isthegoat.github.io/Portfolio-";
```

This is the **last-resort fallback** — it only runs when none of
`NEXT_PUBLIC_SITE_URL`, `VERCEL_PROJECT_PRODUCTION_URL` or
`NEXT_PUBLIC_PAGES_ORIGIN` is set. The deploy workflow always sets
`NEXT_PUBLIC_SITE_URL`, so **the deployed site is correct even if you forget
this**. It still matters for a local production build and for anyone reading the
repo, so update it:

```ts
return "https://<new-owner>.github.io/<new-repo>";
```

Prefer to clear the smell entirely — derive it, so no future transfer needs a
code change:

```ts
// Optional: allow the deploy to inject the origin, and fall back to the
// documented production URL. Kept as a literal because this module also runs
// in the browser bundle, where process.env.GITHUB_REPOSITORY is not defined.
return process.env.NEXT_PUBLIC_PAGES_ORIGIN?.trim() || "https://<new-owner>.github.io/<new-repo>";
```

---

## 6. The project links you probably *don't* want to change

`src/data/projects.ts` contains two links to **other repositories** on the old
account:

- line 65 — Spendwise → `github.com/messi10istheGoat/Expense-Tracker`
- line 197 — Sylhet Live → `github.com/messi10istheGoat/Clg-Project`

These are separate repos. Transferring the portfolio does **not** move them, so
those links keep working. Two options:

1. **Leave them** — they still resolve, and the case studies still describe real
   code. Simplest and lowest risk.
2. **Transfer those repos too**, then update the two URLs to the new owner.

Do not 404 yourself by rewriting these to the new owner without moving the repos.

---

## 7. Regenerate the résumé

`public/resume.pdf` is committed, and it bakes in both the GitHub profile URL and
the portfolio URL at generation time:

```
GitHub: https://github.com/messi10istheGoat
Portfolio: https://messi10isthegoat.github.io/Portfolio-
Generated ... from messi10isthegoat.github.io/Portfolio-
```

It reads `siteUrl` and `profile.socials.github`, so after updating `site.ts` and
(if you're changing handles) `src/data/profile.ts`, run:

```bash
npm run resume
git commit -am "chore: regenerate résumé for new owner"
```

This is easy to miss because nothing *breaks* — the PDF just keeps advertising
the old account. It is regenerated automatically during `npm run build:static`,
so the deployed copy fixes itself; only the committed file goes stale.

---

## 8. Update README

One line, in the Deployment section:

```
3. Live at `https://<new-owner>.github.io/<new-repo>/`.
```

---

## 9. Your local clone

The old URL redirects, so `git push` keeps working — but point it at the new
home to avoid surprises (the redirect dies permanently if anything is ever
created at the old path):

```bash
git remote set-url origin https://github.com/NEW_OWNER/NEW_REPO.git
git remote -v            # verify
git fetch origin
```

If you use SSH, the same with `git@github.com:NEW_OWNER/NEW_REPO.git`.

---

## 10. Deployed elsewhere?

**Vercel** — a connected Vercel project follows the repo only if it is
reconnected. In the Vercel dashboard, reconnect the Git integration to the new
owner, or re-import the repo. Nothing in `vercel.json` names an owner, so no
config change is needed. `VERCEL_PROJECT_PRODUCTION_URL` is set by Vercel at
build time, so canonical URLs follow automatically.

**Custom domain** — if you had one, re-add it under `Settings → Pages → Custom
domain` *after* the transfer, and update DNS. Remove the old `CNAME` before
transferring to avoid domain takeover.

---

## Verify when you're done

```bash
# 1. deploy is green on the new repo
gh run list --repo NEW_OWNER/NEW_REPO --workflow deploy.yml --limit 3

# 2. the built HTML advertises the new origin, not the old one
curl -s https://NEW_OWNER.github.io/NEW_REPO/ | grep -o '<link rel="canonical"[^>]*>'
#    expect https://NEW_OWNER.github.io/NEW_REPO/   (or just the origin for a user site)

# 3. assets resolve — the base path is the usual casualty
curl -sI https://NEW_OWNER.github.io/NEW_REPO/_next/static/ | head -1

# 4. sitemap and feed point at the new host
curl -s https://NEW_OWNER.github.io/NEW_REPO/sitemap.xml | grep -o '<loc>[^<]*</loc>' | head -3

# 5. no old-owner strings left in the repo
grep -rni "messi" --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=out .
```

Step 2 is the one that catches a stale canonical URL; step 3 catches a broken
`basePath`, which is what a site looks like when it loads unstyled with 404s on
every script.

---

## Short version

1. Merge open work, note Pages/variables/secrets/protection.
2. Transfer (accept the email within a day).
3. Re-enable Pages → GitHub Actions; run the deploy workflow.
4. Re-create variables (`GITHUB_USERNAME`), secrets (`GH_ACTIVITY_TOKEN`), and
   branch protection.
5. Update `src/lib/site.ts` fallback + README line, then `npm run resume`.
6. `git remote set-url origin …`.
7. Leave the two project links alone unless you move those repos too.
