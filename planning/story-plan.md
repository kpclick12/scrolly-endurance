# Almgrens första maraton

Arbetsversion, 30 augusti 2026

## Det läsaren ska förstå

Andreas Almgren har redan farten. Maratonsatsningen handlar om hur mycket av den som finns kvar efter tre mil. Den frågan leder från maratonets historia via en fysisk fartjämförelse till fysiologin och vidare till hans träningsmetod.

## Form

Berättelsen använder en slingrande väg som i Johans referensbild, men vägen är New York-banan och milstolparna är historiska nedslag. Formen används bara där den hjälper: efter historiken rätas vägen ut till en fysiologisk modell och därefter till en träningsvecka.

### 1. Almgren först

En kort redaktionell öppning presenterar nyheten:

- EM-guld på 10 000 meter;
- maratondebut i New York den 1 november 2026;
- 26:45 på 10 kilometer och 58:41 på halvmaraton;
- maratonrutan är ännu tom;
- hans skäl: New York är ett lopp snarare än ett jämnt farthållarstyrt tidsförsök.

Öppningen ska locka in läsaren innan bakgrunden börjar. Den ska inte börja med maratonhistorien.

### 2. New York-banan blir maratonets historia

En bred väg slingrar sig från Staten Island till Central Park. Löparen och vägmarkeringen rör sig framåt. Sex numrerade milstolpar ligger på banan:

1. budbärarlegenden, cirka 490 f.Kr.;
2. Aten 1896, omkring 40 kilometer;
3. London 1908 och 42 195 meter;
4. New York 1970, fyra varv i Central Park;
5. five-borough-banan 1976;
6. Almgrens start 2026.

Texten ligger direkt i scenen. Inga kortbakgrunder.

### 3. Hur fort är världselitens fart?

En låg perspektivkamera följer en löpare på ett tänkt löpband. Läsaren väljer själv fart, med 16 km/h som startvärde.

Fyra rörelser:

1. 16 km/h motsvarar 3:45 per kilometer;
2. Almgrens halvmaratonrekord 58:41 motsvarar 21,6 km/h och 2:47 per kilometer;
3. när Almgren har sprungit 21,1 kilometer når 16-farten 15,6 kilometer;
4. maratonvärldsrekordet 2:00:35 motsvarar nästan exakt 21 km/h i drygt två timmar.

Jämförelsen bygger på genomsnittsfart från officiella sluttider. Den är inte en prognos för Almgrens debut och inte en beskrivning av ett träningspass.

Första versionen använder CSS-perspektiv och vanlig HTML i stället för Three.js. 3D blir motiverat först om den verkliga banans höjd, broar eller kamerarörelse genom New York blir en del av förklaringen. En generisk 3D-värld skulle göra scenen tyngre utan att göra jämförelsen tydligare.

### 4. Vad gör en bra maratonlöpare?

Vägen rätas ut till en 42,195 kilometer lång modell:

```text
fart ≈ syre × hållbar andel / kostnad
```

- VO₂max visar det aeroba taket.
- Tröskel och uthållighet visar hur stor del av taket som kan användas länge.
- Löpekonomi visar syre- och energikostnaden vid en bestämd fart.
- Kroppsmassa visas som last i systemet, inte som en poäng eller idealvikt.
- Efter cirka 30 kilometer börjar linjen tappa höjd. Det visar durability: hur lite kapaciteten försämras efter lång belastning.

Detta är en pedagogisk modell, inte en prognos av Almgrens maratontid.

### 5. Dubbeltröskeln

Den raka distanslinjen blir en träningsvecka. Två dagar innehåller ett kontrollerat tröskelpass både förmiddag och eftermiddag.

Fyra rörelser:

1. dubbeltröskel samlar mycket tröskelarbete på två hårda dagar;
2. laktatprov används som fartbegränsare, inte som mål;
3. metoden förknippas med Ingebrigtsen-brödernas miljö och har använts av Almgren sedan 2019;
4. maratonblocket avviker från grundmodellen genom längre pass, lägre intensitet, mer LT1, energi under löpning och snabb avslutning efter 90 till 100 minuter.

Den illustrerade veckan är ett exempel från beskrivningar av den norska modellen. Den får inte presenteras som Jakobs eller Almgrens exakta vecka 2026.

### 6. Central Park

Banlinjen återkommer. Almgren känner sin kapacitet på 10 000 meter och halvmaraton. New York ger honom den första riktiga datapunkten efter 42 195 meter.

## Vetenskapliga avgränsningar

- De klassiska prestationsfaktorerna är VO₂max, hållbar andel/tröskel och löpekonomi.
- Kroppsmassa påverkar kostnaden men ”lättare är bättre” är inte ett försvarbart generellt råd. Låg energitillgänglighet kan försämra hälsa och prestation.
- Tröskeldefinitioner varierar. Ett universellt laktatvärde ska inte användas.
- Dubbeltröskel är väldokumenterad elitpraxis. Det saknas bevis för att upplägget automatiskt ger bättre tävlingsresultat på lång sikt.
- Laktat är en markör och del av energiomsättningen, inte ett gift som fyller muskeln.

Full källista och begränsningar finns i prototypens metoddel.
