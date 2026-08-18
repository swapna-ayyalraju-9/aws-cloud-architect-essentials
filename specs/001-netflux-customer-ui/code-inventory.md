# Code Inventory: Netflux Customer UI

**Feature**: [spec.md](./spec.md)
**Date**: 2026-08-18

This inventory is the brownfield map for Spec Kit. Name these entities in new specs instead of inventing replacements.

## Product surface

| Area | Path | Notes |
| --- | --- | --- |
| Page shell | `netflux/customer-service/src/main/resources/static/index.html` | Bootstrap 4 layout: profile card, movie tabs, not-found card |
| UI behavior | `netflux/customer-service/src/main/resources/static/js/script.js` | Customer load, genre change, recommended vs all movies |
| Images | `netflux/customer-service/src/main/resources/static/images/` | `customer-{id}.png`, `404.png` |

## customer-service

| Area | Path |
| --- | --- |
| App entry | `netflux/customer-service/src/main/java/com/vinsguru/CustomerServiceApplication.java` |
| Customer API | `netflux/customer-service/src/main/java/com/vinsguru/controller/CustomerController.java` |
| Customer logic | `netflux/customer-service/src/main/java/com/vinsguru/service/CustomerService.java` |
| Movie client | `netflux/customer-service/src/main/java/com/vinsguru/client/MovieClient.java` |
| Customer DTO | `netflux/customer-service/src/main/java/com/vinsguru/dto/CustomerDto.java` |
| Genre update DTO | `netflux/customer-service/src/main/java/com/vinsguru/dto/GenreUpdateRequest.java` |
| Movie DTO (UI payload) | `netflux/customer-service/src/main/java/com/vinsguru/dto/MovieDto.java` |
| Genre enum | `netflux/customer-service/src/main/java/com/vinsguru/domain/Genre.java` |
| Not-found handling | `netflux/customer-service/src/main/java/com/vinsguru/exceptions/CustomerNotFoundException.java` |
| Exception advice | `netflux/customer-service/src/main/java/com/vinsguru/advice/ApplicationExceptionHandler.java` |

## movie-service

| Area | Path |
| --- | --- |
| Movie API | `netflux/movie-service/src/main/java/com/vinsguru/controller/MovieController.java` |
| Movie logic | `netflux/movie-service/src/main/java/com/vinsguru/service/MovieService.java` |
| Movie entity | `netflux/movie-service/src/main/java/com/vinsguru/entity/Movie.java` |
| Genre enum | `netflux/movie-service/src/main/java/com/vinsguru/domain/Genre.java` |

## Local data

| Area | Path |
| --- | --- |
| Compose database | `netflux/postgres/docker-compose.yaml` |
| Seed SQL | `netflux/postgres/init.sql` |

## Current vs intended UI stack

The shipped UI on this branch is a static HTML page with vanilla JavaScript. The constitution requires **React 18** (function components and hooks) for future UI implementation work, still served from `static/` unless a later spec introduces a frontend toolchain.
