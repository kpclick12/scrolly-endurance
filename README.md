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
