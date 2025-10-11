# TODO

Central backlog for multi-area initiatives. Update entries as scopes evolve.

---

## Study Bible Integration (Plain Meaning Bible)

Goal: surface the entire World English Bible on the Plain Meaning Bible page using the frontend only.

### In Progress / Next Steps
- [ ] Load `docs/bible-data/web.xml` client-side (single fetch) and parse the OSIS DOM once at page load.
- [ ] Derive an in-memory index of books (canonical order, display names, chapter counts) to drive navigation.
- [ ] Add Book and Chapter dropdowns plus next/previous buttons; wire them to the OSIS index.
- [ ] Render the selected chapter using existing OSIS styling classes (preserve footnotes, references).
- [ ] Show a minimal loading indicator while the XML fetch/parsing occurs.
- [ ] Keep the styling checklist/demo section available (move into a secondary panel/tab if needed).
- [ ] Document the current frontend-only flow in `docs/bible-data/README.md` for future contributors.

### Future Enhancements
- Smart “go to reference” input (e.g., `Hos 12`, `John 3:16`).
- Optional preprocessing pipeline when we need lighter per-chapter payloads.
- Commentary panes, cross-reference toggles, or backend-powered navigation once available.
