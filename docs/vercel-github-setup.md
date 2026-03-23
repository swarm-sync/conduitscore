# Vercel ↔ GitHub for `conduitscore`

## What we traced (2026-03-23)

| Check | Result |
|--------|--------|
| Local `git remote` | `https://github.com/bkauto3/conduitscore.git` |
| Vercel project | `bens-projects-4026/conduitscore` (`prj_4HgiyG0GUNG46cnhqDNilHJtl8j6`) |
| `GET /v9/projects/conduitscore` → `link` | **empty** — **no Git repository connected** |
| `vercel git connect https://github.com/bkauto3/conduitscore.git` | **400** — Vercel could not link (access / GitHub App / private repo) |
| Deploy Hooks API | **404** — *“project is not connected to any repository so it cannot have deploy hooks”* |

So: **pushes to GitHub never triggered Vercel** because the project was never linked to Git.

The Vercel CLI session is **`zachchipman2020-8763`**. Linking **`bkauto3/conduitscore`** usually requires either:

- the **same** GitHub user as repo owner, or  
- the **Vercel GitHub App** installed on **`bkauto3`** with access to **`conduitscore`**.

---

## Fix A — GitHub Actions (already added)

Workflow: `.github/workflows/deploy-production.yml`

1. Create a Vercel token: [vercel.com/account/tokens](https://vercel.com/account/tokens) (must be allowed to deploy this project).
2. In **GitHub** → repo **`bkauto3/conduitscore`** → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:
   - Name: `VERCEL_TOKEN`
   - Value: paste the token.
3. Push to **`main`**; the workflow runs `vercel deploy --prod`.

`VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` are set in the workflow file (they are not secret).

---

## Fix B — Native Vercel Git (optional, nicer UX)

Do this when logged into **Vercel** with a user that can install apps on **`bkauto3`** (often **`bkauto3`** on GitHub):

1. **GitHub** → **Settings** → **Applications** → **Vercel** → configure access → ensure **`conduitscore`** is allowed (for orgs: org **Settings** → **Third-party access** / **GitHub Apps**).
2. **Vercel** → **conduitscore** → **Settings** → **Git** → **Connect Git Repository** → choose **`bkauto3/conduitscore`**, production branch **`main`**.

After that, you can remove the GitHub Action if you want a single source of truth.

---

## Fix C — CLI (when GitHub App access is fixed)

```bash
cd phase_5_output   # repo root
npx vercel git connect https://github.com/bkauto3/conduitscore.git
```

Use a machine/session where `vercel login` matches a GitHub user who can grant the Vercel app access to that repo.
