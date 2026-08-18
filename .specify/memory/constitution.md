# Netflux Constitution

## Core Principles

### I. Spec-First on a Living Codebase
This repository is an existing product, not a greenfield scaffold. Specifications describe intended behavior for a change; they do not authorize rewriting working services. New features, UI changes, and API contract changes start as Spec Kit artifacts under `specs/` before implementation. Reference existing entities by name (`Customer`, `Movie`, `Genre`, customer-service, movie-service) so agents stay consistent with the current domain.

### II. Preserve Service Boundaries
Netflux is two independently deployable Spring Boot services plus a browser UI served as static assets from customer-service. Do not collapse services, invent a BFF, or move UI hosting unless a spec explicitly requires it. customer-service owns customer profile and genre preference; movie-service owns the movie catalog; the UI talks to the existing REST paths.

### III. Contract Compatibility (NON-NEGOTIABLE)
Public HTTP contracts are part of the product. Additive changes are preferred. Breaking changes to `/api/customers`, `/api/movies`, JSON field names, status codes, or query parameters require an explicit spec and a migration note in the plan. Do not change DTO shapes to suit a frontend refactor.

### IV. UI Continuity With React 18
The customer-facing UI lives in `netflux/customer-service/src/main/resources/static/`. Future UI work uses React 18 function components and hooks, keeps the current Bootstrap 4 visual language, and continues to be served by Spring Boot static resources unless a spec introduces a separate frontend toolchain. Do not add a SPA build, router, or state library without a spec. Preserve the current user journeys: profile, genre change, recommended movies, all movies, and customer-not-found.

### V. Smallest Sufficient Change
Prefer the smallest change that satisfies the spec. Do not introduce new frameworks, infrastructure, or demo-only features. Keep the AWS learning-lab character of this repository: services stay runnable locally and in the existing container/CI layout.

## Technology Constraints

- Backend: Java / Spring Boot 3.x as already used by customer-service and movie-service.
- Data: PostgreSQL via the existing repositories and Docker Compose database. Do not add a second datastore for UI features.
- UI: React 18 (hooks) + Bootstrap 4, loaded as static assets. Fetch the existing REST APIs with `fetch`.
- Genres remain `ACTION`, `COMEDY`, `CRIME`, and `DRAMA`.
- Customer identity in the UI is the `customer` query parameter (default `1`). There is no login in the current product.

## Development Workflow

1. `/speckit-constitution` only when project principles change.
2. `/speckit-specify` for each feature or behavior change. For UI work, describe user-visible behavior, not the stack.
3. `/speckit-clarify` when the spec has open questions.
4. `/speckit-plan` to record how the change fits the existing Spring Boot + static React UI layout.
5. `/speckit-tasks` then `/speckit-analyze` before `/speckit-implement`.
6. `/speckit-converge` after implementation to catch remaining gaps.

Existing-code changes use a living spec: update `spec.md` when intended behavior changes, then refresh plan and tasks. Do not leave implementation that contradicts the active spec.

## Governance

This constitution supersedes ad-hoc agent instructions when they conflict. PRs that add Spec Kit features must include the matching `specs/<nnn>-<name>/` artifacts. Complexity, new dependencies, and breaking API changes must be justified in the plan. Amendments to this constitution require an updated version, date, and a short rationale in the spec or PR that introduces them.

Use [SPEC-KIT.md](../../SPEC-KIT.md) for operator guidance on installing the CLI, refreshing managed files, and running the workflow on this repo.

**Version**: 1.0.0 | **Ratified**: 2026-08-18 | **Last Amended**: 2026-08-18
