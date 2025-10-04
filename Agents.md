# Agents Notes - Codex

## Interaction Modes
- Treat user prompts ending with a question mark as Q&A mode: focus on answers and read-only exploration (inspecting files, folders, logs), but do not modify anything or run side-effecting commands unless explicitly asked afterward.
- For action requests (user states the desired change/run), proceed with the usual plan-execute workflow and confirm results.

## Git Workflow Guidance
- Create short-lived feature branches (e.g., `feat/...`, `fix/...`, `chore/...`) off `main`; rebase with the latest `main` before opening a PR.
- Keep `main` deployment-ready by merging only through reviewed PRs after local verification and any required CI.
- Craft commits as "type: short imperative summary" (optionally add a scope, e.g., `feat(auth): ...`); group related changes together and rebase-squash noisy interim commits before review.
- Document context in the commit body or PR description: why the change is needed, highlights of the implementation, and testing performed (or deliberately skipped).
- Run the relevant tests/linters before pushing; note any gaps in the PR.
- Delete feature branches after merge to keep the namespace clean.

## Architecture Signals Worth Remembering
- Frontend is a framework-free Web Components app (`docs/index.html`) orchestrated by a router using History API state (`docs/utils/router.js`). Google auth flows persist user JSON in `localStorage`; `auth-guard` relies on that state to gate protected routes.
- `docs/assets/config.js` auto-selects API base URLs and secrets. Frontend calls must include the `X-API-Key` header using this value or the Spring filter in `backend/src/main/java/com/nghood/christianity/security/ApiKeyAuthenticationFilter.java` will reject the request.
- Bible data loads entirely in memory at backend startup via `BibleDataService` (`backend/src/main/java/com/nghood/christianity/service/BibleDataService.java`), pulling 66 JSON manifests from `backend/src/main/resources/data/bible`. Any new data must respect that boot-time cost.
- `BibleReadingPlanService` shuffles OT/NT pairings with size balancing while `BibleGameService` enforces per-chapter verse expansion; both services return simple POJOs consumed directly by the frontend.

## Deployment & Ops Considerations
- Docker Compose stacks (`docker-compose.yml`, `docker-compose.local.yml`) front everything with Nginx. The production infra script (`infrastructure/server-setup.sh`) lays down `/app` with Compose, certificates, and env scaffolding.
- GitHub Actions workflow (`.github/workflows/deploy.yml`) builds the Spring jar, pushes a Docker image, rsyncs the static frontend, and restarts the Lightsail stack; expect deployment to reuse those jobs.
- `application.properties` currently defaults `spring.jpa.hibernate.ddl-auto` to `create-drop`; unless overridden through env (`JPA_DDL_AUTO`), deployments will wipe data, which `private/TODO.md` flags as critical.

## Product Direction Cues
- SEO roadmap (hash-to-path migration, nginx routing, Compose tweaks) is documented in `private/TODO.md`; expect future work to align with that phased plan.
- `private/bible-verse-game-todo.md` captures deeper backlog for the verse game (difficulty, translation expansion, data weighting). Use it to guide enhancements beyond the shipped MVP.

## Collaboration Reminders
- Right sidebar slots in `<main-layout>` are optional; some pages clear them explicitly. Preserve that behavior when introducing new pages.
- Keep Google Identity client IDs centralized in `docs/config/google-auth.js`; avoid duplicating secrets.
- Document any new operational risks or deviations here so future agents inherit non-trivial context without digging through source.

