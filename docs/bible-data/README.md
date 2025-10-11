# World English Bible Asset

- Translation: World English Bible (Public Domain)
- Format: OSIS 2.1.1 XML (`web.xml`)
- Retrieved: 2025-10-12
- Source: Public domain distribution curated by gratis-bible/bible

Keep this file alongside any derived artifacts so future updates track the same upstream text.

## Current Usage
- The Plain Meaning Bible page (`docs/pages/plain-meaning-bible.js`) fetches `web.xml` client-side and renders the chapter selected by the user.
- No preprocessing pipeline is active yet; regeneration simply means replacing `web.xml` with a fresh copy and committing the change after validation.
