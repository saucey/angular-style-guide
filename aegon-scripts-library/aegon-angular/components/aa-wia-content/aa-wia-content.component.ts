/**
 * aa-wia-content.component.ts created on 9/29/16 2:20 PM.
 *
 * @description Provides functionality for showing/hiding content under headers.
 * @author Florian Popa <florian@webgenerals.com>
 */
import {
    Component, ElementRef, OnInit, OnChanges, Input,
    trigger, state, animate, transition, style
} from '@angular/core';
import {AABaseComponent} from "../../lib/classes/AABaseComponent";

const template = require('./template.html');

@Component({
    selector: 'aa-wia-content',
    providers: [],
    template: template,
    animations: [

        trigger('shrinkOut', [
            state('in', style({
                height: '*'
            })),
            transition('void => *', [
                style({
                    height: 0
                }),
                animate('150ms 0 ease-out', style({
                    height: '*'
                }))
            ]),
            transition('* => void', [
                style({
                    height: '*'
                }),
                animate('150ms 0 ease-in', style({
                    height: 0
                }))
            ])
        ])
    ]
})

/**
 * Collapsible content component
 */
export class AAWiaContentComponent extends AABaseComponent implements OnInit {

    public topicsList = [
        {
            title: 'Wat krijgt u in deze regeling?',
            topics: [
                {
                    image: 'https://s3-eu-west-1.amazonaws.com/anl-ma-staticcontent/content/pensioen123/test/arbeidsongeschiktheidspensioen.png',
                    intro: '<p>Uw werkgever sloot voor u de:</p>' +
                    '<p><span class="phld">als IVA-EXCED</span>IVA-EXCEDIVA-Excedentverzekering <span class="phld">Dekperc</span>. Met de IVA-Excedentverzekering krijgt u een uitkering als u volgens het UWV minimaal 80% duurzaam arbeidsongeschikt bent.</p>' +
                    '<p><span class="phld">als WGA-EXCED</span>WGA-Excedentverzekering <span class="phld">Dekperc</span>. Met de WGA-Excedentverzekering krijgt u een uitkering als u volgens het UWV minimaal 35% arbeidsongeschikt bent, maar niet minimaal 80% duurzaam.</p>' +
                    '<p><span class="phld">als WGA-AANV en Soort-aanvulling = LIGHT</span>WGA-Aanvullingsverzekering light. Met de WGA-Aanvullingsverzekering light krijgt u een uitkering als u volgens het UWV recht heeft op een WGA-vervolguitkering.</p>' +
                    '<p><span class="phld">als WGA-AANV en Soort-aanvulling = STANDAARD of leeg</span> WGA-Aanvullingsverzekering. Met de WGA-Aanvullingsverzekering krijgt u een uitkering als u volgens het UWV minimaal 35% arbeidsongeschikt bent, maar niet 80% of meer.</p>' +
                    '<p><span class="phld">als WGA-AANV en Soort-aanvulling = UPGRADE</span> WGA-Aanvullingsverzekering upgrade. Met de WGA-Aanvullingsverzekering upgrade krijgt u een uitkering als u volgens het UWV minimaal 35% arbeidsongeschikt bent, maar niet 80% of meer.</p>' +
                    '<p><span class="phld">als WIA-35MIN en Variant ≠ BODEM</span> WIA-35minverzekering. Met de WIA-35minverzekering krijgt u een uitkering als u volgens het UWV minder dan 35% arbeidsongeschikt bent.</p>' +
                    '<p><span class="phld">als WIA-35MIN en Variant = BODEM</span> Met de WIA-Bodemverzekering krijgt u een uitkering als u volgens het UWV 15% of meer arbeidsongeschikt bent, maar minder dan 35%.</p>',
                    text: '<p><span class="phld">als IVA-EXCEDIVA</span>-Excedentverzekering <span class="phld">Dekperc</span>. U kan niet meer werken. Volgens het UWV bent u 80% of meer arbeidsongeschikt. Verder denkt het UWV niet dat u in de komende vijf jaar weer kan gaan werken. U krijgt daarom een IVA-uitkering. De hoogte van de IVA-uitkering van het UWV is 75% van uw salaris voordat u arbeidsongeschikt werd. Verdiende u voordat u arbeidsongeschikt werd meer dan de loongrens voor de sociale verzekeringen (2016: € 52.766,37)? Dan krijgt u voor het loon boven die loongrens geen uitkering van het UWV. Met de IVA-Excedentverzekering krijgt u dan wel een uitkering voor het loon boven die loongrens.</p>' +
                    '<p><span class="phld">als WGA-EXCED</span> WGA-Excedentverzekering <span class="phld">Dekperc</span>.U kan langere tijd niet of minder werken. U krijgt daarom een WGA-uitkering van het UWV. Verdiende u voordat u arbeidsongeschikt werd meer dan de loongrens voor de sociale verzekeringen (2016: € 52.766,37)? Dan krijgt u voor het loon boven die loongrens geen uitkering van het UWV. Met de WGA-Excedentverzekering krijgt u dan wel een uitkering voor het loon boven die loongrens.</p>' +
                    '<p><span class="phld">als WGA-AANV en Soort-aanvulling = LIGHT</span>WGA-Aanvullingsverzekering light. U kan langere tijd niet of minder werken. Dan komt uw inkomen in gevaar. Het UWV bepaalt hoeveel u nog wél kan werken en wat u daarmee nog kan verdienen. Dit noemen we uw ‘restverdiencapaciteit’. De hoogte van uw uitkering van het UWV hangt af van deze restverdiencapaciteit. En van wat u verdiende voordat u arbeidsongeschikt werd. Met de WGA-Aanvullingsverzekering light krijgt u een uitkering als u volgens het UWV recht heeft op een WGA-vervolguitkering.</p>' +
                    '<p><span class="phld">als WGA-AANV en Soort-aanvulling = STANDAARD, leeg of UPGRADE</span>WGA-Aanvullingsverzekering <span class="phld">upgrade</span>.U kan langere tijd niet of minder werken. Dan komt uw inkomen in gevaar. Het UWV bepaalt hoeveel u nog wél kan werken en wat u daarmee nog kan verdienen. Dit noemen we uw ‘restverdiencapaciteit’. De hoogte van uw uitkering van het UWV hangt af van deze restverdiencapaciteit. En van wat u verdiende voordat u arbeidsongeschikt werd. Met de WGA-Aanvullingsverzekering <span class="phld">upgrade</span> krijgt u een uitkering als u volgens het UWV minimaal 35% arbeidsongeschikt bent, maar niet 80% of meer.</p>' +
                    '<p><span class="phld">als WIA-35MIN en Variant ≠ BODEM</span>WIA-35minverzekering. <br />Bent u langer dan twee jaar arbeidsongeschikt? Dan komt u in de WIA en kan u er in inkomen flink op achteruitgaan. Bent u volgens de WIA-beschikking van het UWV minder dan 35% arbeidsongeschikt? Dan krijgt u zelfs helemaal geen uitkering. Met de WIA-35minverzekering krijgt u een uitkering als u volgens het UWV minder dan 35% arbeidsongeschikt bent.</p>' +
                    '<p><span class="phld">als WIA-35MIN en Variant = BODEM</span> Bent u langer dan twee jaar arbeidsongeschikt? Dan komt u in de WIA en kan u er in inkomen flink op achteruitgaan. Bent u volgens de WIA-beschikking van het UWV minder dan 35% arbeidsongeschikt? Dan krijgt u zelfs helemaal geen uitkering. Met de WIA-Bodemverzekering krijgt u een uitkering als u volgens het UWV 15% of meer arbeidsongeschikt bent, maar minder dan 35%.</p>'
                },
                {
                    image: 'https://s3-eu-west-1.amazonaws.com/anl-ma-staticcontent/content/pensioen123/test/reglement.png',
                    intro: 'Wilt u precies weten wat deze regeling u biedt? Kijk op <a href="www.aegon.nl/pensioenwet">www.aegon.nl/pensioenwet</a> of vraag de polisvoorwaarden bij ons op.',
                    text: '<p>Wilt u precies weten wat deze regeling u biedt? Kijk dan in de polisvoorwaarden. U vindt deze op <a href="www.aegon.nl/pensioenwet">www.aegon.nl/pensioenwet</a> onderaan de pagina onder de downloads of vraag de polisvoorwaarden bij ons op.</p>' +
                    '<p>Let op: <br />Neemt u via uw werkgever ook deel in een pensioenregeling met een uitkering bij uw pensionering en/of een uitkering aan uw eventuele partner en/of kinderen als u overlijdt? Dan ontvangt u hiervan een apart overzicht van het pensioenfonds of de verzekeraar. U kunt ook kijken op www.mijnpensioenoverzicht.nl voor informatie over uw andere pensioenregelingen en uw AOW.</p>'
                }
            ]
        },
        {
            title: 'Wat krijgt u in deze regeling niet?',
            topics: [
                {
                    image: 'https://s3-eu-west-1.amazonaws.com/anl-ma-static-content/content/pensioen123/test/ouderdomspensioen_geen.png',
                    intro: 'In deze regeling krijgt u geen ouderdomspensioen. Het kan zijn dat u ouderdomspensioen opbouwt in een andere pensioenregeling.',
                    text: ''
                },
                {
                    image: 'https://s3-eu-west-1.amazonaws.com/anl-ma-static-content/content/pensioen123/test/partner_en_wezenpensioen_geen.png',
                    intro: 'Komt u te overlijden? In deze regeling krijgt uw eventuele partner dan geen partnerpensioen en krijgen uw eventuele kinderen dan geen wezenpensioen. Het kan zijn dat u partner- en/of wezenpensioen in een andere pensioenregeling heeft.',
                    text: ''
                },
                {
                    image: 'https://s3-eu-west-1.amazonaws.com/anl-ma-staticcontent/content/pensioen123/test/arbeidsongeschiktheidspensioen_geen.png',
                    intro: 'Wordt u ziek nadat u uit dienst bent gegaan bij deze werkgever? Dan krijgt u geen arbeidsongeschiktheidspensioen van ons.',
                    text: ''
                }
            ]
        },
        {
            title: 'Hoe bent u verzekerd?',
            topics: [
                {
                    image: 'https://s3-eu-west-1.amazonaws.com/anl-ma-staticcontent/content/pensioen123/test/drie_pijlers.png',
                    intro: '<p>U bent op drie manieren verzekerd bij arbeidsongeschiktheid:</p>' +
                    '<p>A. De Wet werk en inkomen naar arbeidsvermogen (WIA). De WIA-uitkering is een arbeidsongeschiktheidsuitkering van de overheid als u in Nederland werkt. Op <a href="www.uwv.nl">www.uwv.nl</a> leest u meer over de WIA-uitkering.</p>' +
                    '<p>B. Uw arbeidsongeschiktheidspensioen bij Aegon. U bent hiervoor verzekerd via uw werkgever. Hierover gaat dit Pensioen 1-2-3.</p>' +
                    '<p>C. Een uitkering bij arbeidsongeschiktheid die u zelf misschien regelde.</p>',
                    text: '<p>U bent op drie manieren verzekerd bij arbeidsongeschiktheid: <br />A. De Wet werk en inkomen naar arbeidsvermogen (WIA). <br />Als u (gedeeltelijk) arbeidsongeschikt wordt, ontvangt u eerst twee jaar lang een inkomen van uw werkgever. Dat is de loondoorbetaling door uw werkgever. Bent u na twee jaar nog steeds ziek? Dan kijkt het UWV of uw werkgever en u wel voldoende hun best hebben gedaan om u aan het werk te krijgen. Is dat zo? Dan keurt het UWV u. Het UWV bepaalt welk werk u nog kunt doen. En wat u daarmee kunt verdienen. Dit heet uw restverdiencapaciteit. <br />Uw arbeidsongeschiktheidspercentage is de verhouding tussen uw restverdiencapaciteit en uw salaris dat u had voordat u ziek werd. Het arbeidsongeschiktheidspercentage bepaalt welke regeling voor u geldt:</p>' +
                    '<p>1. U krijgt geen uitkering <br/>U bent minder dan 35% arbeidsongeschikt. U krijgt geen uitkering.</p>' +
                    '<p>2. U krijgt een WGA-uitkering <br />U bent minimaal 35% arbeidsongeschikt. Of u bent minimaal 80% arbeidsongeschikt en het UWV denkt dat u in de komende 5 jaar weer meer kunt gaan werken. Dan krijgt u een uitkering vanuit de regeling Werkhervatting Gedeeltelijk Arbeidsgeschikten (WGA). Deze regeling maakt onderdeel uit van de WIA.</p>' +
                    '<p>3. U krijgt een IVA-uitkering <br />U bent minimaal 80% arbeidsongeschikt. En het UWV denkt dat u in de komende 5 jaar niet meer kunt gaan werken. Dan krijgt u een uitkering vanuit de regeling Inkomensvoorziening Volledig Arbeidsongeschikten (IVA). Deze regeling maakt onderdeel uit van de WIA. <br />Op <a href="www.uwv.nl">www.uwv.nl</a> leest u meer over de WIA-uitkering.</p>' +
                    '<p>B. Uw arbeidsongeschiktheidspensioen bij Aegon. U bent hiervoor verzekerd via uw werkgever. Hierover gaat dit Pensioen 1-2-3. <br /><span class="phld">als IVA-EXCED</span> Met de IVA-Excedentverzekering krijgt u een uitkering als u volgens het UWV minimaal 80% duurzaam arbeidsongeschikt bent. <br />><span class="phld">als WGA-EXCED</span> Met de WGA-Excedentverzekering krijgt u een uitkering als u volgens het UWV minimaal 35% arbeidsongeschikt bent, maar niet minimaal 80% duurzaam. <br /><span class="phld">als WGA-AANV en Soort-aanvulling = LIGHT</span> Met de WGA-Aanvullingsverzekering light krijgt u een uitkering als u volgens het UWV recht heeft op een WGA-vervolguitkering. <span class="phld">als WGA-AANV en Soort-aanvulling = STANDAARD, leeg of UPGRADE</span> Met de WGA-Aanvullingsverzekering <span class="phld">upgrade</span> krijgt u een uitkering als u volgens het UWV minimaal 35% arbeidsongeschikt bent, maar niet 80% of meer. <br /><span class="phld">als WIA-35MIN en Variant ≠ BODEM</span> Met de WIA-35minverzekering krijgt u een uitkering als u volgens het UWV minder dan 35% arbeidsongeschikt bent. <br /><span class="phld">als WIA-35MIN en Variant = BODEM</span> Met de WIA-Bodemverzekering krijgt u een uitkering als u volgens het UWV 15% of meer arbeidsongeschikt bent, maar minder dan 35%.</p>' +
                    '<p>C. Een uitkering bij arbeidsongeschiktheid die u zelf misschien regelde. Bijvoorbeeld een arbeidsongeschiktheids- of woonlastenverzekering.</p>'
                },
                {
                    image: 'https://s3-eu-west-1.amazonaws.com/anl-ma-staticcontent/content/pensioen123/test/arbeidsongeschiktheidspensioen.png',
                    intro: '<p>Bent u na twee jaar ziekte volgens het UWV 35% of meer arbeidsongeschikt? Dan komt u in de WIA. De WIA is de Wet werk en inkomen naar arbeidsvermogen. Via die wet krijgt u een uitkering. De WIA is een ingewikkelde wet en is onder te verdelen in twee regelingen:</p>' +
                    '<p>U bent minimaal 35% arbeidsongeschikt, maar niet minimaal 80% duurzaam. U krijgt dan een WGA-uitkering.</p>' +
                    '<p>U bent minimaal 80% duurzaam arbeidsongeschikt. U krijgt dan een IVA-uitkering.</p>' +
                    '<p>Ondanks deze wettelijke uitkeringen, kan u er in inkomen op achteruit gaan als u arbeidsongeschikt bent. <span class="phld">als WGA-EXCED en/of WGA-AANV en geen IVA-EXCED</span>Deze regeling geeft een aanvulling op uw</p>' +
                    '<p>Benieuwd naar uw andere pensioenaanspraken? Kijk dan op <a href="www.mijnpensioenoverzicht.nl">www.mijnpensioenoverzicht.nl</a>. <br />Meer weten over uw arbeidsongeschiktheidspensioen? Kijk dan op <a href="www.aegon.nl/pensioenwet">www.aegon.nl/pensioenwet</a>.</p>' +
                    '<p>WGA-uitkering. Uw uitkering stopt als u de AOW-leeftijd bereikt of nog daarvoor <span class="phld">Eindlftd</span> jaar wordt.<span class="phld">als WGA-EXCED</span>De aanvulling vanuit uw WGA-Excedentverzekering <span class="phld">Dekperc</span> berekenen wij over uw <span class="phld">Loonbegrip</span> tot en met € <span class="phld">Afw_maxln</span>.</p>' +
                    '<p><span class="phld">als IVA-EXCED en geen WGA-EXCED en/of WGA-AANV</span>Deze regeling geeft een aanvulling op uw IVA-uitkering. De aanvulling vanuit uw IVA-Excedentverzekering <span class="phld">Dekperc</span> berekenen wij over uw <span class="phld">Loonbegrip</span> tot en met € <span class="phld">Afw_maxln</span>. Uw uitkering stopt als u de AOW-leeftijd bereikt of nog daarvoor <span class="phld">Eindlftd</span> jaar wordt.</p>' +
                    '<p><span class="phld">als IVA-EXCED en WGA-EXCED en/of WGA-AANV</span> Deze regeling geeft een aanvulling op uw IVA- en WGA-uitkering. Uw uitkering stopt als u de AOW-leeftijd bereikt of nog daarvoor <span class="phld">Eindlftd</span> jaar wordt. <span class="phld">als WGA-EXCED</span> De aanvulling vanuit uw WGA-Excedentverzekering <span class="phld">Dekperc</span> berekenen wij over uw <span class="phld">Loonbegrip</span> tot en met € <span class="phld">Afw_maxln</span>. <span class="phld">als IVA-EXCED</span> De aanvulling vanuit uw IVA-Excedentverzekering <span class="phld">Dekperc</span> berekenen wij over uw <span class="phld">Loonbegrip</span> tot en met € <span class="phld">Afw_maxln</span>.</p>' +
                    '<p><span class="phld">als WIA-35MIN en Variant ≠ BODEM</span> Bent u na twee jaar ziekte volgens het UWV minder dan 35% arbeidsongeschikt? Dan krijgt u geen WIA-uitkering. U zoekt dan in overleg met uw werkgever passend werk. Met dit passend werk verdient u mogelijk minder. Deze regeling geeft dan <span class="phld">Uitkduur</span> jaar een aanvulling op uw nieuwe loon. Uw uitkering stopt als u de AOW-leeftijd bereikt of nog daarvoor 70 jaar wordt.</p>' +
                    '<p><span class="phld">als WIA-35MIN en Variant = BODEM</span> Bent u na twee jaar ziekte volgens het UWV minimaal 15 arbeidsongeschikt, maar minder dan 35%? Dan krijgt u geen WIA-uitkering. U zoekt dan in overleg met uw werkgever passend werk. Met dit passend werk verdient u mogelijk minder. Deze regeling geeft dan 7,5 jaar een aanvulling op uw nieuwe loon. Uw uitkering stopt als u de AOW-leeftijd bereikt of nog daarvoor 70 jaar wordt.</p>',
                    text: ''
                },
                {
                    image: 'https://s3-eu-west-1.amazonaws.com/anl-ma-static-content/content/pensioen123/test/premieverdeling_beide.png',
                    intro: '<p>Uw werkgever betaalt de premie voor uw regeling. Uw werkgever kan met u afgesproken hebben dat u de premie helemaal of voor een deel aan hem terugbetalen. Deze premie vindt u dan terug op uw loonstrook. Omdat de premie wordt afgetrokken van uw brutoloon, betaalt u hierover geen loonbelasting en premies sociale verzekeringen.</p>',
                    text: ''
                }
            ]
        },
        {
            title: 'Welke keuzes heeft u?',
            topics: [
                {
                    image: 'https://s3-eu-west-1.amazonaws.com/anl-ma-staticcontent/content/pensioen123/test/keuze.png',
                    intro: 'U kunt stoppen met deelname aan deze regeling.',
                    text: ''
                },
                {
                    image: 'https://s3-eu-west-1.amazonaws.com/anl-ma-staticcontent/content/pensioen123/test/pensioenvergelijker.png',
                    intro: 'Wilt u uw pensioenregeling vergelijken? U vindt de pensioenvergelijker op <a href="www.aegon.nl/pensioenwet">www.aegon.nl/pensioenwet</a> onderaan de pagina onder de downloads of u kunt deze bij ons opvragen.',
                    text: ''
                }
            ]
        },
        {
            title: 'Hoe zeker is uw uitkering?',
            topics: [
                {
                    image: 'https://s3-eu-west-1.amazonaws.com/anl-ma-static-content/content/pensioen123/test/indexatie.png',
                    intro: '<p><span class="phld">als IVA-EXCED en/of WGA-EXCED en/of WGA-AANV IVA-Excedentverzekering IvaEx_dekperc% ,/en WGA-Excedentverzekering WgaEx_dekperc% en WGA-Aanvullingsverzekering (light/upgrade)</span> <br />Uw uitkering wordt elk jaar op 1 januari <Klim_srt> verhoogd. Hieronder ziet u wat de afgelopen drie jaar de gemiddelde jaarlijkse prijsstijging voor consumenten was. Zo kunt u vaststellen in hoeverre de uitkering waardevast was.</p>' +
                    '<table><thead><tr><th>Jaar</th><th>Prijsstijging</th><th>Stijging uitkering</th></tr></thead><tbody>' +
                    '<tr><th>t-1</th><th><span class="phld">CBS-prijsindex t-1</span></th><th>Klim_srt t-1</th></tr>' +
                    '<tr><th>t-2</th><th><span class="phld">CBS-prijsindex t-2</span></th><th>Klim_srt t-2</th></tr>' +
                    '<tr><th>t-3</th><th><span class="phld">CBS-prijsindex t-3</span></th><th>Klim_srt t-3</th></tr>' +
                    '</tbody></table>' +
                    '<p><span class="phld">WIA-35minverzekering/WIA-Bodemverzekering</span> <br />Uw uitkering wordt elk jaar op 1 januari met de CBS-loonindex verhoogd. Hieronder ziet u wat de afgelopen drie jaar de gemiddelde jaarlijkse prijsstijging voor consumenten was. Zo kunt u vaststellen in hoeverre de uitkering waardevast was.</p>' +
                    '<table>' +
                    '<thead>' +
                    '<tr><th>Jaar</th><th>Prijsstijging</th><th>Stijging uitkering</th></tr>' +
                    '</thead>' +
                    '<tbody>' +
                    '<tr><th>t-1</th><th>CBS-prijsindex t-1</th><th>Index t-1</th></tr>' +
                    '<tr><th>t-2</th><th>CBS-prijsindex t-2</th><th>Index t-2</th></tr>' +
                    '<tr><th>t-3</th><th>CBS-prijsindex t-3</th><th>Index t-3</th></tr>' +
                    '</tbody>' +
                    '</table>',
                    text: ''
                },
                {
                    image: 'https://s3-eu-west-1.amazonaws.com/anl-ma-staticcontent/content/pensioen123/test/uitkeringszekerheid_risico.png',
                    intro: '<p>De hoogte van uw uitkering is afhankelijk van hoeveel u nog wel kunt werken en hoeveel u daarmee verdient.</p>',
                    text: '<p>Benieuwd naar uw andere pensioenaanspraken? Kijk dan op <a href="www.mijnpensioenoverzicht.nl">www.mijnpensioenoverzicht.nl</a>. <br /> Meer weten over uw arbeidsongeschiktheidspensioen? Kijk dan op <a href="www.aegon.nl/pensioenwet">www.aegon.nl/pensioenwet</a>.</p>' +
                    '<p>De hoogte van uw uitkering is afhankelijk van hoeveel u nog wel kunt werken en hoeveel u daarmee verdient.</p>'
                }
            ]
        },
        {
            title: 'Welke kosten maken wij?',
            topics: [
                {
                    image: 'https://s3-eu-west-1.amazonaws.com/anl-ma-staticcontent/content/pensioen123/test/kosten.png',
                    intro: '<p>Aegon maakt kosten om de regeling uit te voeren.</p>',
                    text: ''
                }
            ]
        },
        {
            title: 'Wanneer moet u in actie komen?',
            topics: [
                {
                    image: 'https://s3-eu-west-1.amazonaws.com/anl-ma-staticcontent/content/pensioen123/test/arbeidsongeschiktheidspensioen.png',
                    intro: '<p>Als u arbeidsongeschikt wordt.</p>',
                    text: '<p>Als u arbeidsongeschikt wordt. Als u (gedeeltelijk) arbeidsongeschikt wordt, ontvangt u eerst twee jaar lang een inkomen van uw werkgever. U krijgt minimaal 70% van uw loon. Dit loon kan gemaximeerd zijn. Kijk daarvoor in uw arbeidsovereenkomst of CAO.</p>'
                },
                {
                    image: 'https://s3-eu-west-1.amazonaws.com/anl-ma-staticcontent/content/pensioen123/test/mijnpensioenoverzicht.png',
                    intro: '<p>Bekijk eens per jaar hoeveel pensioen u heeft opgebouwd op <a href="www.mijnpensioenoverzicht.nl">www.mijnpensioenoverzicht.nl</a>. <br />Let op: Deze arbeidsongeschiktheidspensioenregeling staat daar niet.</p>',
                    text: '<p>Bekijk eens per jaar hoeveel pensioen u heeft opgebouwd op <a href="www.mijnpensioenoverzicht.nl">www.mijnpensioenoverzicht.nl</a>. <br />Let op: Deze arbeidsongeschiktheidspensioenregeling staat daar niet.</p>'
                },
                {
                    image: 'https://s3-eu-west-1.amazonaws.com/anl-ma-staticcontent/content/pensioen123/test/keuze.png',
                    intro: '<p>Als u gebruik wilt maken van de mogelijkheid om te stoppen met deelname aan deze regeling.</p>',
                    text: '<p>Als u gebruik wilt maken van de mogelijkheid om te stoppen met deelname aan deze regeling.</p>'
                },
                {
                    image: 'https://s3-eu-west-1.amazonaws.com/anl-ma-staticcontent/content/pensioen123/test/vragen.png',
                    intro: '<p>Heeft u vragen of bent u arbeidsongeschikt? Neem dan contact op met uw werkgever. Op <a href="www.aegon.nl/pensioenwet">www.aegon.nl/pensioenwet</a> kunt u ook terecht voor meer informatie.</p>',
                    text: '<p>Heeft u vragen of bent u arbeidsongeschikt? Neem dan contact op met uw werkgever. Op <a href="www.aegon.nl/pensioenwet">www.aegon.nl/pensioenwet</a> kunt u ook terecht voor meer informatie.</p>'
                }
            ]
        }
    ];

    /**
     * Active item location by row and column
     */
    public activeItem = {
        row: null,
        column: null
    };

    public activeRowId;

    public showFullText: boolean = false;

    public visibility: string = 'hidden';

    constructor(private elementRef: ElementRef) {
        super(elementRef);
    }

    /**
     * Sets the active item by row and column
     *
     * @param row
     * @param column
     */
    public setActiveItem = (row, column) => {
        this.setShowFullText(false);
        if (this.activeItem.row === row && this.activeItem.column === column) {
            this.activeItem.row = null;
            this.activeItem.column = null;
        } else {
            this.activeItem.row = row;
            this.activeItem.column = column;
        }
    }

    /**
     * Retrieves the active item
     *
     * @returns {Object}
     */
    public getActiveItem = () => {
        return this.activeItem;
    }

    public isFullTextShown = (description) => {
        return this.showFullText && this.isDescriptionTextValid(description);
    }

    public setShowFullText = (showFullText) => {
        this.showFullText = showFullText;
        if (showFullText) {
            this.visibility = 'shown';
        } else {
            this.visibility = 'hidden';
        }
    }

    /**
     * Checks if the description has the text property and value
     *
     * @param description
     * @returns {boolean}
     */
    public isDescriptionTextValid = (description) => {
        if (description.hasOwnProperty('text') && typeof description.text != 'undefined' && description.text != null && description.text.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
