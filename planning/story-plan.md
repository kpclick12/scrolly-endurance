# Kommer Almgren att slå banrekordet i New York Marathon?

Arbetsversion, 2 september 2026

## En sak att minnas

Andreas Almgren har redan farten. Den öppna frågan är om han kan behålla tillräckligt mycket av den i 42 195 meter på New Yorks bana för att hota 2:04:58.

## Berättelsens rörelser

1. **Frågan.** Almgrens 10-kilometers- och halvmaratontider står bredvid New Yorks banrekord. Hans maratonruta är tom.
2. **Banan.** En schematisk New York-karta följer loppets verkliga ordning genom fem stadsdelar. Sex stopp bär maratonets historia från legenden till Almgrens debut.
3. **Fältet.** 56 381 löpartider från 2025 bildar en fördelningskurva. Kameran går från hela fältet till den lilla elitkanten.
4. **Farten.** Tre löpare startar tillsammans på en tänkt 400-metersbana. En fyratimmarslöpare varvas efter 2:10,7 av Almgrens halvmaratonfart och efter 2:28,3 av New Yorks rekordfart.
5. **Kroppen.** En kvarliggande illustration växlar mellan mekanik, syretransport, löpekonomi och förmågan att behålla dem efter 30 kilometer.
6. **Träningen.** Omkring 200 kilometer per vecka leder till dubbeltröskel, laktatstyrning och 35–40 kilometer långa maratonspecifika pass.
7. **Den tomma tiden.** Banrekordet visas igen bredvid Almgrens ännu okända maratontid.

## Visuell princip

- Formen hämtar sin disciplin från 1984 års New York Marathon-affisch: varm pappersyta, svart högkontrasttypografi och koncentrerade fält av färg där loppet eller mätningen pågår.
- **Mätlinjen** är berättelsens visuella ryggrad. Den börjar som vägen mot Almgrens tomma maratonruta, blir New York-banan, fördelningskurvan, 400-metersovalen, kroppens mätstråk, träningsmängden och slutligen linjen fram till den ännu okända tiden.
- Textsystemet är en familj, inte ett enda kort: öppen affischtypografi i intro och kapitelstarter, tävlingskort i historien, målgångsremsor för jämförbara tider och tekniska marginalnoter för kropp och träning.
- Ingen 3D i första versionen. SVG gör banan, kroppens system och exakta rörelser lättare att läsa och billigare att köra på mobil.
- Rödorange betyder fart, rekord eller aktiv mätning. Blått betyder vatten, syre eller referens. Grönt betyder bana och uthållighet. Gult används sparsamt för energi eller en kontrollpunkt.
- Bara en mättad färg ska dominera ett ögonblick. Målad textur hör hemma i visualer och övergångar, inte bakom löpande text.
- Siffermarkeringar används endast när ett tal bär nästa resonemang.
- Zoom används för att byta skala, inte som dekoration: från hela New York-banan till en plats, och från hela tidsfördelningen till elitens vänsterkant.
- På desktop står text och visual bredvid varandra. På mobil ligger visualen kvar upptill och texten går in under den som en hel affischyta. Historiekorten är det enda tydligt fristående kortsystemet.

## Analogi och metafor

- Historiedelen har två samtidiga skalor: kilometer under fötterna och årtal i korten. Korten märks som historiska nedslag så att geografi och historia inte blandas ihop.
- 400-meterslöparna fungerar som tre metronomer. Varvtiden, inte en dramatisk effekt, visar skillnaden i rytm.
- Syretransporten förklaras som en sammanhängande logistikkedja från luft till arbetande muskel.
- Löpekonomi är kostnaden för samma fart. Laktatmätning är återkoppling på belastningen, ungefär som en instrumentpanel, inte en giftmätare.
- Efter 30 kilometer hålls språket konkret. Batteri-, bränsletank- och motorbilder används inte eftersom de förenklar fysiologin för mycket.

## Data och beräkningar

Fördelningen använder 15-minutersintervall från ett publikt dataset med 56 381 löpartider i New York Marathon 2025. 99 rullstols- och handcykelresultat har tagits bort med startnummerserien som klassmarkör. NYRR redovisar 59 226 officiellt fullföljande. Runner’s World anger medeltiden 4:32:25. Löparurvalets medelvärde är 4:32:45. De viktigaste härledda värdena är:

- vanligaste intervall: 3:45–4:00, 6 241 löpare eller 11,1 procent
- under tre timmar: 2 396 löpare eller 4,2 procent
- fyratimmarsfart: 10,549 km/h och 2:16,51 per 400 meter
- banrekordsfart 2:04:58: 20,259 km/h och 1:11,08 per 400 meter
- Almgrens 58:41-fart: 21,571 km/h och 1:06,76 per 400 meter

400-metersscenen räknar positionen som `(fart i meter per sekund × tid) modulo 400`. Den antar konstant genomsnittsfart och ska inte läsas som New York-banans faktiska fartprofil eller en prognos för Almgrens maraton.

## Material som lämnats bort

- den generiska perspektivvägen och löpbandsreglaget
- den tidigare abstrakta prestationsformeln
- jämförelsekort mellan namngivna löpare
- Three.js och dekorativ 3D
- en synlig lång källista mitt i berättelsen
- det fristående konceptlabbet

## Redaktionella gränser

- Rubriken är en journalistisk fråga. Almgren har inte offentligt lovat ett rekordförsök.
- 58:41 är halvmaratonfart, inte en maratonprognos.
- Inget exakt VO₂max-värde tillskrivs Almgren. Intervallet 70–85 ml/kg/min kommer från publicerade studier av manlig maratonelit.
- Träningsveckan är en principbild. Den gör inte anspråk på att återge hans exakta vecka.
- Laktatmätning beskrivs som återkoppling. Inget universellt målvärde anges.
