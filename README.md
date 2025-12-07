# URL Collector (Chrome Extension)

URL Collector is a minimal Chrome extension that collects URLs from all open tabs and lets you filter and copy them quickly.

## Features
- List URLs from all open tabs
- Filter by window scope: All, Current, Others
- Domain filter with Include/Exclude mode (matches hostname substring)
- RegEx filter with Include/Exclude mode (matches full URL)
- Copy currently displayed URLs to clipboard

## Installation (Load Unpacked)
1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable `Developer mode` (top-right toggle).
3. Click `Load unpacked` and select this folder.
4. Click the extension icon to open the popup.

## Usage
1. Open the popup from the toolbar.
2. Optionally set filters:
   - Window: `All` (default), `Current`, or `Others`.
   - Domain: enter a hostname fragment (e.g., `example.com`) and choose `Include` to keep matches or `Exclude` to remove them.
   - RegEx: enter a JavaScript regex (e.g., `^https://.+/docs`) and choose mode `Include` or `Exclude`.
3. Click `Apply` to refresh the list.
4. Click `Copy` to copy the currently displayed URLs to the clipboard.
5. Use `Clear` to reset filters (Window=All, Domain/RegEx empty).

## Notes
- Permissions: The extension requests the `tabs` permission to read tab URLs.
- Window filter uses the active tab's window as "Current".
- Domain filter checks `hostname` only (case-insensitive substring). Examples:
  - `example.com` matches `www.example.com`, `sub.example.com`.
- RegEx filter tests against the entire URL string.
- Invalid RegEx currently results in an empty list (can be changed to show an error message if preferred).

## Files
- `manifest.json` — Chrome Manifest V3 with `tabs` permission and popup action.
- `popup.html` — Popup UI layout.
- `popup.css` — Popup styles.
- `popup.js` — Logic to query tabs, apply filters, and copy results.

## Development
- Edit the files and then click `Reload` on the extension in `chrome://extensions/` to see changes.
- No background/service worker is needed for current functionality; the popup queries tabs directly.

## Roadmap (Optional Enhancements)
- Show validation message for invalid regex.
- Domain match modes: exact / endsWith / contains.
- Window picker by title/ID.
- Export to file (txt/csv) and copy with titles.

## License
MIT License. See `LICENSE` for details.
