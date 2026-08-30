# Almgrens första maraton

En första statisk scrollytelling-prototyp om Andreas Almgrens maratondebut i New York. Den börjar med satsningen, följer sedan en slingrande New York-bana genom maratonets historia och gör elitfarten fysisk i en jämförande löpbandsscen. Därefter växlar den till prestationsfysiologi, dubbeltröskel och Almgrens maratonspecifika träning.

## Starta lokalt

Projektet har inga externa beroenden. Servera mappen lokalt, till exempel:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Öppna sedan `http://127.0.0.1:4173/`.

## Filer

- `index.html`: berättelse och semantisk struktur
- `styles.css`: layout, visuell identitet och responsiva kompositioner
- `app.js`: den scrollstyrda banan, fysiologiska tillstånd och träningsveckans scenbyten
- `planning/story-plan.md`: redaktionell plan och källbas
- `planning/concept-lab.html`: tidigare visuellt koncepttest
