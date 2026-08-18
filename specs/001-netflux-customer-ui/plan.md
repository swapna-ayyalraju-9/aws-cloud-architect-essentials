# Implementation Plan: Netflux Customer UI (As-Built)

**Branch**: `001-netflux-customer-ui` | **Date**: 2026-08-18 | **Spec**: [spec.md](./spec.md)

**Input**: Baseline specification for the existing customer-facing UI.

## Summary

Keep the current Netflux customer experience: a browser UI served by customer-service, backed by customer-service and movie-service REST APIs. This plan records the as-built stack so later Spec Kit features can extend it instead of replacing it.

## Technical Context

**Language/Version**: Java 17+ / Spring Boot 3.x for services; JavaScript with React 18 for future UI work (current tree still uses a static page plus `js/script.js`)

**Primary Dependencies**: Spring Web, Spring Data JPA, Bootstrap 4.6, `fetch` against same-origin `/api/*`

**Storage**: PostgreSQL (customer rows and movie catalog)

**Testing**: Existing Spring Boot tests with Testcontainers; UI currently has no dedicated frontend test suite

**Target Platform**: Browser UI hosted by customer-service; Linux containers for both services

**Project Type**: Brownfield web application (static UI + two REST microservices)

**Performance Goals**: Demo-scale; page should render a single customer profile and movie table without additional tooling

**Constraints**: Do not break `/api/customers` or `/api/movies`. Do not add a separate frontend build unless a later spec requires it.

**Scale/Scope**: One profile card, two movie views, four genres, no auth

## Constitution Check

- Spec-first: this directory is the living baseline for UI behavior.
- Service boundaries: customer-service hosts UI + customer API; movie-service owns catalog.
- Contract compatibility: existing JSON DTOs and status codes stay as-is.
- UI continuity: later implementation uses React 18 hooks while preserving Bootstrap 4 layout.
- Smallest sufficient change: no new frameworks in this baseline.

## Project Structure

### Documentation (this feature)

```text
specs/001-netflux-customer-ui/
├── spec.md              # Living baseline of user-visible behavior
├── plan.md              # This as-built plan
├── code-inventory.md    # Map of current source files
└── contracts/           # Existing HTTP contracts used by the UI
```

### Source Code (repository root)

```text
netflux/
├── customer-service/
│   ├── src/main/java/com/vinsguru/   # customer API, movie client, DTOs
│   └── src/main/resources/static/    # UI assets (index.html, js/script.js, images)
├── movie-service/
│   └── src/main/java/com/vinsguru/   # movie catalog API
└── postgres/                         # local database compose + init SQL
```

## As-Built Approach

1. Browser loads static `index.html` from customer-service.
2. UI reads `?customer=` (default 1) and calls `GET /api/customers/{id}`.
3. customer-service loads the customer, asks movie-service for movies in that genre, and returns profile plus `recommendedMovies`.
4. Genre changes use `PATCH /api/customers/{id}/genre` then reload the customer.
5. All-movies view uses `GET /api/movies`.
6. Unknown customers render the not-found card instead of the profile.

## Future UI Guidance

When a later feature asks to implement or refactor the UI, use React 18 function components and hooks in `netflux/customer-service/src/main/resources/static/`, keep Bootstrap 4 classes, and continue calling the contracts in `contracts/`. Do not change this baseline spec unless user-visible behavior is intended to change.
