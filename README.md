# The Cars Club

A static gallery site: one homepage that opens onto five Cars fan pages. No build step, framework, backend, or account system.

## Host it

Upload the contents of this folder to the document root of any static host. Every internal link is relative, so it also works from a subfolder. A server that serves directory index files gives you clean addresses:

| Address | File | Page |
| --- | --- | --- |
| `/` | `index.html` | The Cars Club — the gallery |
| `/cars/` | `cars/index.html` | 01 · The Scenic Route — *Cars* |
| `/cars-2/` | `cars-2/index.html` | 02 · The Cars 2 Defense Bureau |
| `/cars-3/` | `cars-3/index.html` | 03 · The Next Lap — *Cars 3* |
| `/cars-land/` | `cars-land/index.html` | 04 · Cars Land Appreciation Society |
| `/carsdb/` | `carsdb/index.html` | 05 · CarsDB — the catalogue front page |

`404.html` is included; point your host's not-found handler at it. No single-page-app rewrite is needed.

To preview locally:

```bash
python -m http.server 8000 --directory cars-club
```

Opening `index.html` straight off disk also works — `club-shell.js` detects `file://` and keeps the `index.html` filenames in links. Browser storage rules differ on `file://`, so prefer the local server when testing the roadbook.

## What changed from the original packages

**The gimmicks came out.** The site no longer downloads anything, writes anything to a file, or asks you to compose a message for another person:

- **Cars Land** — removed *Save as a text file* (the dream-lap `.txt` download) and *Copy the manifesto*, along with the manual-copy fallback dialog. The dream-lap checklist and the verdict stamp still work; they just stay in the browser.
- **CarsDB (old companion)** — the whole page was replaced (see below), which removed the JSON backup export and import.
- **Cars 2** — removed *Copy my verdict* and its fallback textarea. The verdict dialog now points at the copypasta instead. *Print the dossier* was left alone; it's neither a download nor a message.
- **Cars 3** — removed the encouragement-note form entirely (recipient field, message box, prompt chips, save, copy, clear, and its `localStorage` key). The three prompts it used to seed are now simply printed on the card, with a line asking you to say one out loud to someone.
- **The Scenic Route** — removed *Copy note*. The private reflection and its optional on-device save stay.

**One clipboard button survives, on purpose.** The Cars 2 page has a new **copypasta** section (`#the-pasta`) between the cross-examination and the verdict: a dark terminal slab holding `cars2_is_cinema.txt`, with a **Copy the pasta** button. A copypasta you can't copy is just a paragraph. If the browser blocks the clipboard, the text is selected in place and the status line says so.

**CarsDB is now a real front page.** The old collector companion — a six-character showcase with its own local notebook — was replaced by `carsdb/index.html`, a landing page for the actual project at [cars.arrangedgodly.com](https://cars.arrangedgodly.com). It holds no catalogue data and stores nothing; it introduces the real one. Its numbers were read off the live site in September 2026:

- 1,455 vehicles, 30 series, 17 tags, 61 pages of results
- all 30 series and all 17 tags listed by name
- a hand-drawn preview of the catalogue UI using six real entries and their real ratings at the time
- what the app does: search/sort/filter, half-star ratings, owned & wishlist

It borrows the club's typography (Barlow Condensed / DM Sans / DM Mono) but takes its palette from the live app: `#0b0c0e` ground, `#e31c1c` red, checkered-flag mark.

**The gallery grew to five roads.** `index.html` gained a CarsDB section, a fifth entry in the red route strip, a fifth route-finder choice, and a fifth option in the "find your route" dialog. Section numbering shifted, and the shared shell now tracks five pages instead of four.

## Editing

| What | Where |
| --- | --- |
| Gallery content | `index.html` |
| Gallery design | `assets/hub.css` (CarsDB styles are the `.db-*` block at the end) |
| Gallery interactions & route copy | `assets/hub.js` (the `routes` object) |
| Shared top bar and onward links | `assets/club-shell.css` |
| Shared link handling, menu, roadbook | `assets/club-shell.js` (the `IDS` array) |
| The copypasta | `cars-2/index.html`, section `#the-pasta` |
| CarsDB page | `carsdb/index.html` — self-contained, styles inline |
| Each fan page | its own `index.html`, still a standalone source file |

To add or rename a route, update the `IDS` array in `club-shell.js`, the `routes` object in `hub.js`, the gallery's route strip / cards / finder, and the `cc-switcher` menu that is hard-coded into every page (it is inline markup so it works without JavaScript).

## Privacy and state

The only thing this site adds is `cars-club.roadbook.v1` in `localStorage` — a list of which of the five pages you have opened, not whether you read them. The reset control clears only that key. Individual pages keep their own original storage keys for notes and saved stops.

There is no account system, analytics, cookie, tracker, third-party script, form submission, or file download anywhere on the site. The single clipboard write happens only when you click the copypasta button.

Web fonts come from Google Fonts, and the Cars 2 gallery card and hero request one optional film still from a remote image host; both fall back cleanly offline. Everything else — text, illustrations, navigation, interactions — is local.

## Credits

An independent, unofficial fan project. Not affiliated with or endorsed by Disney, Pixar, or Mattel. *Cars* characters, imagery, names, and related trademarks belong to their respective owners. The enthusiasm is ours.

Original page credits and source lists are preserved on each page. Illustrations are original stylised fan art; none of them depict a specific Mattel release. Rankings and superlatives on this site are fan opinion, not official or critical consensus.

## What was checked

Every page was rendered in Chromium at 1280 and 390 pixels wide with no document-level horizontal overflow and no JavaScript console errors. All 305 local link, asset, and fragment references were resolved against the packaged files. The dream-lap dialog was exercised in both its empty and populated states after the download button was removed, and the copypasta copy button was exercised through its blocked-clipboard fallback path.

Live hosting, DNS, and remote font/image availability were not tested. The clipboard success path could not be confirmed under automation — browsers require a real user gesture — so only the fallback was observed working.
