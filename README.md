# Almgren i New York

En fristående scrollytelling-prototyp om Andreas Almgrens maratondebut och frågan om New Yorks banrekord. Berättelsen använder banan genom staden som historisk tidslinje, verkliga sluttider från 2025, ett 400-metersbaserat farttest, originalritad fysiologi och en schematisk träningsdel. Formspråket hämtar färgdisciplin, högkontrasttypografi och resultatband från en New York Marathon-affisch från 1984. En återkommande mätlinje binder ihop berättelsens olika skalor.

## Starta lokalt

Projektet har inga externa beroenden.

```bash
python3 -m http.server 4174 --bind 127.0.0.1
```

Öppna `http://127.0.0.1:4174/`.

## Filer

- `index.html`: berättelse, SVG-scener, källor och semantisk struktur
- `styles.css`: redaktionell form, sticky-layouter och mobilkomposition
- `app.js`: kartscroll, diagramzoom och den matematiska 400-metersanimationen
- `planning/story-plan.md`: redaktionell idé, rörelser, data och avgränsningar

Lägg till `?motion=reduce` för att kontrollera versionen utan övergångsrörelser.

Formpass september 2026: blågrå bas, nummerlappar vid historiska stopp, fyra fartnivåer, animerad fysiologi, träningsdagbok och målband. Handstilen Caveat laddas lokalt från `assets/fonts/`; licensen ligger i samma mapp.

Träningskalendern visar en illustrativ vecka i ett maratonblock med inspiration från Almgrens intervjuer och Bakken som metodkälla för dubbeltröskel. Scrollningen zoomar in olika dagar; passens källor och avgränsningar finns i `planning/training-research.md`. Avslutet är ett målområde byggt i HTML/CSS med en tom tidtavla för Almgren.

## Testversion på GitHub Pages

Push till `main` publicerar automatiskt testversionen på https://kpclick12.github.io/scrolly-endurance/ via `.github/workflows/pages.yml`. Flödet kontrollerar JavaScript och publicerar sidans HTML, CSS, JavaScript och assets. Pages används för test; publicering på den egna webbplatsen görs separat senare.
