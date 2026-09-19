# Kommer Almgren att slå banrekordet i New York Marathon?

Arbetsversion, 6 september 2026

## En sak att minnas

Andreas Almgren har redan farten. Den öppna frågan är om han kan behålla tillräckligt mycket av den i 42 195 meter på New Yorks bana för att hota 2:04:58.

## Berättelsens rörelser

1. **Frågan.** Almgrens 10-kilometers- och halvmaratontider står bredvid New Yorks banrekord. Hans maratonruta är tom.
2. **Banan.** En schematisk New York-karta följer loppets verkliga ordning genom fem stadsdelar. Sex stopp bär maratonets historia från legenden till Almgrens debut.
3. **Fältet.** 56 381 löpartider från 2025 bildar en fördelningskurva. Kameran går från hela fältet till den lilla elitkanten.
4. **Farten.** Tre löpare startar tillsammans på en tänkt 400-metersbana. En fyratimmarslöpare varvas efter 2:10,7 av Almgrens halvmaratonfart och efter 2:28,3 av New Yorks rekordfart.
5. **Kroppen.** En anatomisk plansch visar löparen med ett förstorat utsnitt av vad och hälsena. Nästa steg följer syret genom lungor, hjärta och muskel. Samma löparbild återkommer i en jämförelse av syrebehov vid 18 km/h. En lugn, illustrativ kurva avslutar med förmågan att behålla farten.
6. **Träningen.** En linjerad träningsdagbok ligger kvar medan scrollningen fokuserar fyra anteckningar: cirka 200 kilometer per vecka, dubbeltröskel, laktatkontroll och 35–40 kilometer långa långpass. Ett illustrativt veckoschema finns på vänstersidan. På mobil visas anteckningssidan ensam för att hålla texten läsbar. Kort kursiv marginaltext och rödbruna pennmarkeringar ger bokkänsla utan att brödtexten blir handskriven.
7. **Den tomma tiden.** Banrekordet visas igen bredvid Almgrens ännu okända maratontid.

## Visuell princip

- Formen hämtar sin disciplin från 1984 års New York Marathon-affisch: vit eller neutralt ljusgrå pappersyta, svart högkontrasttypografi och koncentrerade fält av färg där loppet eller mätningen pågår. Ingen beige patina, inte heller i träningsboken. Affischens blått, rött, grönt och gult används som begränsade accenter.
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
- Inget VO₂max-värde tillskrivs Almgren. Syretransporten förklaras utan ett sifferintervall som kan förväxlas med hans mätvärde.
- Anatomiplanscherna är AI-genererade pedagogiska illustrationer. Löpbilden visar ett exempel på frånskjut, ingen ideal löpstil. Hälsenans fjäderanalogi förklarar återförd energi utan att antyda att musklerna slutar arbeta.
- Löpekonomin jämför syrebehov per kilo kroppsvikt vid samma fart. Staplarnas längder är illustrativa, inte data. Uthållighetskurvan har ingen numerisk y-axel och trettio kilometer är ingen biologisk gräns.
- Träningsveckan är en principbild. Den gör inte anspråk på att återge hans exakta vecka.
- Laktatmätning beskrivs som återkoppling. Inget universellt målvärde anges.


## Återföring 8 september
Den senaste arbetskopian från cfdd har återförts: affischstart, anatomiska bildplanscher, träningsbok och deras tillgänglighetslogik. Förfiningar läggs ovanpå: sval bas, nummerlappar, fyra fartnivåer, kartdetaljer, målband och subtil animation av de befintliga anatomibilderna.


## Träningslogg och målgång, 8 september
Tre Luna-agenter granskade Almgren, Bakken och andra elitlöpare. Se `training-research.md`. Dagboken visar källbelagda pass från tydligt åtskilda perioder. Avslutet ramas in som ett målområde i HTML/CSS. Tom tidtavla för Almgren, separata rekorduppgifter, målstolpar och mållinje. Ingen löparbild används. Originalpostern och anatomibilderna är kvar.

## Varsam koncentrering av berättelsen
Historien har fyra stopp; de olympiska distanserna och New Yorks två tidiga banversioner är sammanslagna. Kartans hållpunkter och skyltar följer de fyra stoppen. Fartsektionen har kortare tolkningar medan exakta tider och avstånd finns kvar i visualen. Övergången till träningen återknyter till Almgrens fart, energiintaget får en kort AIS-källbelagd förklaring och målrubriken knyter ihop rekordet med distansen. Visuell form och befintliga illustrationer bevaras.

## Preflight-korrigeringar, 10 september 2026
Ingen genväg läggs till. Diagrammets medelmarkör använder nu urvalets 4:32:45 och metodtexten anger att orsaken till bortfallet inte är fastställd. Mobila SVG-etiketter håller cirka 12 CSS-pixlar genom zoomlägena och glesas ut. Kartans alternativtext beskriver fyra historiska stopp. Skiplänken landar på fokuserbart main. Språket preciserar kortdistansfarten och minskar upprepningen om löpekonomi.

Kontrollerat: tangentbordsfokus, reducerad rörelse, alternativtexters förekomst, fyra diagramlägen vid 320/390/820/1440 px, inga horisontella överflöden eller JavaScript-fel. Uppmätta kontraster för valda brödtexter, röda anteckningar och axeltext: 5,4–11,7:1. Ingen full skärmläsargranskning genomförd. LinkedIns länkkort återstår att kontrollera när publik adress finns.

## Zoomande maratonkalender, 12 september
Träningssektionen använder nu en kvarliggande kalender med sju dagar och fyra scrollsteg (måndag, tisdag, torsdag, söndag). Innehållet är en märkt exempelvecka inspirerad av Almgrens maratonblock; se senaste avgränsningen i training-research.md. De handskrivna passnoteringarna ligger i textrutorna, medan kalenderns kamera zoomar och flyttar sig. Detaljer för de separata Valencia- och maratonpassen går att fälla ut. Veckoöversikt nås med tangentbord eller knapp.
Verifierat i browser: desktop, 390×844 och 320×568, inga horisontella överflöden eller konsolfel; utfälld långpassnotering, tangentbordsaktivering av veckoöversikten och reducerad rörelse. Originalaffisch, anatomisektion och målgång bevaras.

## Mobilrytm och kartscroll, 12 september 2026
Mobilkorten har mindre rubriker, anteckningar och inre marginaler; brödtexten i sektion 2–5 är fortsatt 16 px. Mellanrummen är 96 svh, och 110 svh för träningskalendern. Alla kort rullar ovanpå visualerna med full opacitet. Scenerna byts först när nästa kort når skärmens mitt, så föregående diagram ligger kvar i mellanrummet. Desktopformen är bevarad.

Kartans geometri beräknas före scrollning och återanvänds, uppdateringar utanför skärmen hoppas över, och mobilkameran får en kort utjämning. Kartans scrollsträcka baseras på stabil skärmhöjd, så adressfältets höjdförändringar inte flyttar positionen. Reducerad rörelse ger direkt uppdatering.

Kontrollerat i webbläsare vid 320×568, 390×844, 430×932, 820×700 och desktop 1280×720: inget horisontellt överflöde, utfällda anteckningar fungerar. Vid 390 px blev träningskorten cirka 20 procent lägre. Fri kalender och bibehållet diagramläge verifierades mellan korten, liksom kartscroll åt båda håll och reducerad rörelse. Inga konsolfel. Flytet på fysisk telefon återstår för användaren att bedöma.

### Justerad efter test på telefon
På användarens begäran återgår sektion 2–4 till tidigare scrollavstånd: 30 svh bottenutfyllnad och 76/78 svh minsta steghöjd. Kartans mellanrum minskas från 96 till 80 svh och kalenderns från 110 till 92 svh. De mindre korten, tydliga lagren och kartans prestandaförbättringar behålls. Kontrollerat vid 320, 390 och 430 px samt desktop: inga överflöden eller konsolfel. Visuellt kontrollerat att diagrammet behåller rätt läge tills nästa kort når mitten och att kalendern fortfarande syns fritt mellan anteckningarna.

Nästa justering: kartan kortas till 72 svh och kalendern till 82 svh. Anatomisektionen får samma 72 svh mellanrum som kartan för att bilderna ska hinna synas. Sektion 2–3 behåller tidigare avstånd. Vid 390 px verifierades fri vy av lungor, hjärta och muskler med rätt scen kvar när nästa kort närmar sig. Även 320, 430 px och desktop kontrollerades utan överflöden eller konsolfel.

Mobilens aktivering i sektion 4–5 flyttas därefter från skärmens mitt till nederkanten enligt användarens önskemål. Även kalenderns första inzoomning följer kortets inträde. Övriga sektioner och desktop behåller tidigare timing. Verifierat vid 390×844: torsdag aktiverades med kortets topp vid 613 px, syrebilden med nästa kort vid 434 px, och kalendern återgick till tisdag vid bakåtscroll. Inga konsolfel; JavaScript-syntax och diffkontroll godkända.

Kartans röda linje använder nu samma SVG-skalning som löparpunkterna. Klassen med non-scaling-stroke gav fel längd på den synliga linjen när kameran zoomade. Animationens tidssteg begränsas också till minst noll för att undvika ogiltig position vid en tidig bildruta. Träningsrubriken får mindre mobilstorlek och utrymme för frågetecknet. Verifierat visuellt på mobil och desktop, inklusive bakåtscroll; rubriken och sidbredden kontrollerade vid 320, 390, 430, 820 och 1280 px utan överflöde. Inga konsolfel. Syntaxkontroll samt ett isolerat test av tidiga bildrutor, framåt-/bakåtrörelse och slutposition godkända.

## Kartans ankomst och fri löparbana, 13 september
Löparnas förflyttning tidigareläggs så att de når varje kartstopp vid samma scrollposition som stoppet tänds. Första sträckan blir kortare i scrollen och målet får lite mer tid; linje, löpare, kamera och kilometer följs fortfarande åt. Isolerat test verifierar alla ankomstpunkter och kontinuerlig rörelse framåt och bakåt.

På användarens begäran får bara löparbanan ligga framför textrutorna på mobil. De övriga sektionerna behåller korten ovanpå visualen. Verifierat vid 390 px att banan syns över ett överlappande kort och löparpositionerna ändras med scrollen; även sidbredd och lager kontrollerade vid 320 px och desktop 1280 px. Inga konsolfel.

## Opersonlig berättarröst, 18 september
Fem formuleringar med vi/vår/vårt i berättelsen och kalenderns dynamiska bildtext har skrivits om utan jag-form. Träningskalendern behålls som illustrativ exempelvecka utan angiven totalmängd. Sveriges Radio rapporterar den 18 september 33 km per dag i snitt under veckorna efter EM (cirka 231 km per vecka). Uppgiften beskriver den perioden, inte ett fast dagsschema, och ändrar inte kalenderns avgränsning. Källa: https://www.sverigesradio.se/artikel/andreas-almgren-laddad-mojlighet-att-kunna-bli-varldsmastare

## Sista mobilputs, 19 september
Nummerlappens överkant får 12 px extra inre marginal på båda sidor på mobil, så tejpen inte täcker bokstäver eller siffror. Kortet om London undviker dubbla ”blev” och behåller att distansen blev standard senare. Legendkortet säger nu att dagens maratondistans fastställdes långt senare. Löptidsdiagrammet byter zoom när ett kort når mobilskärmens nederkant, som sektion 4–5. Kontrollerat vid 390×844: peak-läget aktivt med kortets topp vid 739 px, återgång till full när toppen var 907 px, och tillbaka till peak vid framåtscroll. Inga konsolfel. Nummerlappens text och tejp kontrollerade visuellt vid 320 och 390 px. Publiceringens absoluta sökvägar och hemlänk bevarade.
