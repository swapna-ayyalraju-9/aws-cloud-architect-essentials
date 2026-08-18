# Feature Specification: Netflux Customer UI (Baseline)

**Feature Branch**: `001-netflux-customer-ui`

**Created**: 2026-08-18

**Status**: Baseline

**Input**: Capture the existing customer-facing Netflux UI so Spec Kit can evolve it without rediscovering current behavior.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View customer profile and recommendations (Priority: P1)

A returning viewer opens Netflux and immediately sees their profile (name, photo, favorite genre) plus a list of movies recommended for that genre.

**Why this priority**: This is the default landing experience and the reason the product exists.

**Independent Test**: Open the app with a known customer id and confirm the profile fields and recommended movie rows match that customer.

**Acceptance Scenarios**:

1. **Given** a valid customer id in the `customer` query parameter, **When** the page loads, **Then** the profile shows that customer's name, photo, and favorite genre, and the movies table lists recommended titles for that genre.
2. **Given** no `customer` query parameter, **When** the page loads, **Then** the app behaves as if customer `1` was requested.
3. **Given** the recommended view is active, **When** the movies table renders, **Then** each row shows position, title, release year, and genre.

---

### User Story 2 - Change favorite genre and refresh recommendations (Priority: P1)

A viewer changes their favorite genre from the profile card and expects recommendations to match the new preference.

**Why this priority**: Genre preference is the only customer-editable setting and drives recommendations.

**Independent Test**: Change genre to each supported value and confirm the displayed favorite genre and recommended list update.

**Acceptance Scenarios**:

1. **Given** a loaded customer profile, **When** the viewer chooses Action, Comedy, Crime, or Drama, **Then** the favorite genre control shows the new value and the recommended movies list refreshes for that genre.
2. **Given** a successful genre change, **When** the viewer looks at the recommended tab, **Then** that tab is the active view.

---

### User Story 3 - Browse the full movie catalog (Priority: P2)

A viewer switches from personalized recommendations to the complete catalog, then back.

**Why this priority**: Catalog browsing is secondary to personalized recommendations but is part of the current product.

**Independent Test**: Toggle between Recommended Movies and All Movies and confirm the table contents and active tab change.

**Acceptance Scenarios**:

1. **Given** a loaded profile, **When** the viewer selects All Movies, **Then** the table lists the full catalog and All Movies is the active tab.
2. **Given** the catalog view is showing, **When** the viewer selects Recommended Movies, **Then** the table returns to that customer's recommended movies and Recommended Movies is the active tab.

---

### User Story 4 - Handle an unknown customer (Priority: P2)

A viewer who follows a link for a customer that does not exist sees a clear not-found state instead of an empty profile.

**Why this priority**: Invalid ids are a normal demo path (`?customer=`).

**Independent Test**: Open the app with an unknown customer id and confirm the not-found card and message.

**Acceptance Scenarios**:

1. **Given** an unknown customer id, **When** the page loads, **Then** the profile and movie table are hidden and a customer-not-found message is shown, including the requested id.

---

### Edge Cases

- What happens when the movies catalog request fails after a successful profile load?
- What happens when a genre change request fails?
- How does the UI behave if recommended movies is an empty list for a valid customer?
- How are titles and years displayed when values are missing or oddly cased?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The UI MUST identify the customer from the `customer` query parameter and default to customer `1` when it is absent.
- **FR-002**: The UI MUST display the customer's name, profile image, and favorite genre for a found customer.
- **FR-003**: The UI MUST let the customer set favorite genre to exactly one of Action, Comedy, Crime, or Drama.
- **FR-004**: After a genre change, the UI MUST persist the preference and show recommendations for the new genre.
- **FR-005**: The UI MUST show recommended movies for the customer's favorite genre on the recommended view.
- **FR-006**: The UI MUST show the full movie catalog on the all-movies view.
- **FR-007**: Each movie row MUST include a 1-based index, title, release year, and genre.
- **FR-008**: The UI MUST show a customer-not-found state when the requested customer does not exist.
- **FR-009**: The UI MUST keep recommended vs all-movies as mutually exclusive views with a visible active tab.
- **FR-010**: The UI MUST keep working without a login or account-creation flow.

### Key Entities

- **Customer**: A viewer identified by numeric id, with a display name, profile image, and one favorite genre.
- **Genre**: One of ACTION, COMEDY, CRIME, DRAMA.
- **Movie**: A catalog title with id, title, release year, and genre.
- **Recommendation set**: The movies associated with a customer's current favorite genre.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A known customer can open the app and see profile plus recommended movies without further navigation.
- **SC-002**: Changing favorite genre updates both the profile control and recommended list in one interaction.
- **SC-003**: Switching between recommended and all-movies views does not require a full page reload.
- **SC-004**: An unknown customer id produces a not-found message that includes the requested id.
- **SC-005**: Existing REST clients that already call `/api/customers` and `/api/movies` continue to work without payload or status-code changes.

## Assumptions

- This spec documents current product behavior; it is not a request to rebuild the UI.
- There is no authentication in this phase.
- Profile images follow the existing `images/customer-{id}.png` convention.
- customer-service remains the host of the static UI and the customer API; movie-service remains the catalog source.
- Future UI implementation work uses React 18 as described in the constitution, without changing these user-visible requirements.
