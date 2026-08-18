# GitHub Spec Kit on this repository

This repo is initialized for [GitHub Spec Kit](https://github.com/github/spec-kit) (Specify CLI **0.16.4**) on the existing Netflux customer UI.

Spec Kit does not replace the Spring Boot services. It adds a spec-driven workflow so Cursor can specify, plan, and implement changes against the current UI and APIs.

## What was added

| Path | Role |
| --- | --- |
| `.specify/` | Spec Kit templates, scripts, constitution, Cursor integration metadata |
| `.cursor/skills/` | Cursor skills (`/speckit-*` commands) |
| `specs/001-netflux-customer-ui/` | Living baseline of the current customer UI |
| `.specify/memory/constitution.md` | Project principles for later features |

The default coding agent integration is **Cursor** (`cursor-agent`).

## One-time CLI install

Spec Kit files are already in the repo. Install the CLI locally if you want to refresh templates or add integrations:

```bash
# uv: https://docs.astral.sh/uv/
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@v0.16.4
specify version
```

## Day-to-day workflow (Cursor)

Open the **repository root** in Cursor so skills under `.cursor/skills/` are picked up.

1. `/speckit-constitution` — only when governing principles change.
2. `/speckit-specify` — describe the next user-visible change. Name existing entities (`Customer`, `Movie`, `Genre`, customer-service).
3. `/speckit-clarify` — optional, before planning.
4. `/speckit-plan` — how it fits the current Spring Boot + static React 18 UI.
5. `/speckit-checklist` / `/speckit-tasks` / `/speckit-analyze` — quality gates.
6. `/speckit-implement` — implement the tasks.
7. `/speckit-converge` — check remaining gaps.

The git extension is installed. `/speckit-specify` will offer `/speckit-git-feature` to create a numbered feature branch (for example `002-short-name`).

### Point commands at a feature

Active feature is **not** inferred from `git checkout`. Point Spec Kit at a spec directory with either:

```bash
# session-only
export SPECIFY_FEATURE_DIRECTORY=specs/001-netflux-customer-ui
```

or a machine-local file (gitignored):

```json
{
  "feature_directory": "specs/001-netflux-customer-ui"
}
```

saved as `.specify/feature.json`.

## Existing UI baseline

`specs/001-netflux-customer-ui/` documents current behavior:

- Profile, favorite genre, recommended movies, all movies, customer not found
- REST contracts in `specs/001-netflux-customer-ui/contracts/`
- Source map in `code-inventory.md`

Treat that spec as a **living spec**: update it when intended UI behavior changes, then refresh plan and tasks. Do not start from a blank spec that redefines `Customer` or the API.

## Refreshing Spec Kit later

Managed files can be refreshed without touching `specs/`:

```bash
specify init --here --force --integration cursor-agent --script sh --ignore-agent-tools --extension git
```

Back up `.specify/memory/constitution.md` first if you customized it; then restore it if the refresh overwrites it.

To use GitHub Copilot instead of Cursor:

```bash
specify integration switch copilot --script sh
```

## Constitution highlights

- Specify before rewriting working services.
- Keep customer-service and movie-service separate.
- Do not break `/api/customers` or `/api/movies`.
- Future UI work uses React 18 hooks, still served from `netflux/customer-service/src/main/resources/static/` unless a spec says otherwise.
