import { ProductAttributesService } from "../product-attributes.service";
import { WiaInputUseCaseEnum } from "../enums/wia-input-use-case.enum";
/**
 * ProductAttributesServiceSpec created on 10/28/16 8:55 AM.
 *
 * @description Tests the behaviour of ProductAttributesService
 * @author Florian Popa <florian@webgenerals.com>
 */

describe('ProductAttributesServiceSpec', () => {

  let productAttributesService: ProductAttributesService;

  beforeEach(() => {
    productAttributesService = new ProductAttributesService();
  });

  it('should remove the attributes when in the default use case', () => {
    let description = {
        "text": "De aanvulling vanuit uw WGA-Excedentverzekering %COVERAGE_RATE_WGA% berekenen wij over uw %WAGE_DEFINITION% tot en met € %DEVIATED_MAXIMUM_WAGE%.",
        "filter": [
          'WGA_EXCED'
        ]
      },
      wiaInput = {
        useCase: WiaInputUseCaseEnum.DEFAULT,
        income: null,
        products: []
      },
      expectedDescription = 'De aanvulling vanuit uw WGA-Excedentverzekering  berekenen wij over uw  tot en met € .';

    let actualDescription = productAttributesService.findAndReplaceAttributes(description, wiaInput);
    expect(actualDescription).toEqual(expectedDescription);
  });

  it('should remove the attributes when in the user case', () => {
    let description = {
        "text": "De aanvulling vanuit uw WGA-Excedentverzekering %COVERAGE_RATE_WGA% berekenen wij over uw %WAGE_DEFINITION% tot en met € %DEVIATED_MAXIMUM_WAGE%.",
        "filter": [
          'WGA_EXCED'
        ]
      },
      wiaInput = {
        useCase: WiaInputUseCaseEnum.USER,
        income: null,
        products: []
      },
      expectedDescription = 'De aanvulling vanuit uw WGA-Excedentverzekering  berekenen wij over uw  tot en met € .';

    let actualDescription = productAttributesService.findAndReplaceAttributes(description, wiaInput);
    expect(actualDescription).toEqual(expectedDescription);
  });

  it('should not replace the attributes if the products do not match', () => {
    let description = {
        "text": "De aanvulling vanuit uw WGA-Excedentverzekering %COVERAGE_RATE_WGA% berekenen wij over uw %WAGE_DEFINITION% tot en met € %DEVIATED_MAXIMUM_WAGE%.",
        "filter": [
          'WGA_EXCED'
        ]
      },
      wiaInput = {
        useCase: WiaInputUseCaseEnum.PARTICIPANT,
        income: null,
        products: []
      },
      expectedDescription = 'De aanvulling vanuit uw WGA-Excedentverzekering %COVERAGE_RATE_WGA% berekenen wij over uw %WAGE_DEFINITION% tot en met € %DEVIATED_MAXIMUM_WAGE%.';

    let actualDescription = productAttributesService.findAndReplaceAttributes(description, wiaInput);
    expect(actualDescription).toEqual(expectedDescription);
  });

  it('should not replace the attributes if the products do not match', () => {
    let description = {
        "text": "De aanvulling vanuit uw WGA-Excedentverzekering %COVERAGE_RATE_WGA% berekenen wij over uw %WAGE_DEFINITION% tot en met € %DEVIATED_MAXIMUM_WAGE%.",
        "filter": [
          'WGA_EXCED'
        ]
      },
      wiaInput = {
        useCase: WiaInputUseCaseEnum.PARTICIPANT,
        income: null,
        products: [{
          "id": "IVA_EXCED",
          "label": "IVA_EXCED",
          "desc": "",
          "selected": false,
          "attrs": [
            {
              "id": "COVERAGE_RATE_IVA",
              "label": "Dekkingsgraad IVA",
              "value": 70,
              "visible": true,
              "options": [
                {
                  "value": 70,
                  "label": "70%"
                },
                {
                  "value": 75,
                  "label": "75%"
                },
                {
                  "value": 80,
                  "label": "80%"
                }
              ]
            },
            {
              "id": "END_AGE",
              "label": "EindLeeftijd",
              "value": 65,
              "visible": false,
              "options": [
                {
                  "value": 65,
                  "label": "65%"
                },
                {
                  "value": 67,
                  "label": "67%"
                },
                {
                  "value": 70,
                  "label": "70%"
                }
              ]
            },
            {
              "id": "BENEFIT_INDEX",
              "label": "Indexering uitkering (Klim_srt)",
              "value": "Geen",
              "visible": false,
              "options": [
                {
                  "value": "Geen",
                  "label": null
                },
                {
                  "value": "CBS",
                  "label": null
                },
                {
                  "value": "2%",
                  "label": null
                },
                {
                  "value": "3%",
                  "label": null
                }
              ]
            },
            {
              "id": "WAGE_DEFINITION",
              "label": "Loonbegrip",
              "value": "belastbaar loon boven de SV-loongrens",
              "visible": false,
              "options": [
                {
                  "value": "belastbaar loon boven de SV-loongrens",
                  "label": null
                },
                {
                  "value": "belastbaar loon boven de SV-loongrens",
                  "label": null
                }
              ]
            },
            {
              "id": "DEVIATED_MAXIMUM_WAGE",
              "label": "Afwijkend Maximum Loon(Afw_maxln)",
              "value": "125.000",
              "visible": false,
              "options": [
                {
                  "value": "125.000",
                  "label": null
                },
                {
                  "value": "meer dan 125.000",
                  "label": null
                }
              ]
            },
            {
              "id": "INSURED_AMOUNT",
              "label": "Verzekerd Bedrag (Verz_bedr)",
              "value": 0,
              "visible": false,
              "options": []
            }
          ]
        }]
      },
      expectedDescription = 'De aanvulling vanuit uw WGA-Excedentverzekering %COVERAGE_RATE_WGA% berekenen wij over uw %WAGE_DEFINITION% tot en met € %DEVIATED_MAXIMUM_WAGE%.';

    let actualDescription = productAttributesService.findAndReplaceAttributes(description, wiaInput);
    expect(actualDescription).toEqual(expectedDescription);
  });

  it('should not replace the attributes if the products do not match', () => {
    let description = {
        "text": "De aanvulling vanuit uw WGA-Excedentverzekering %COVERAGE_RATE_WGA% berekenen wij over uw %WAGE_DEFINITION% tot en met € %DEVIATED_MAXIMUM_WAGE%.",
        "filter": [
          'WGA_EXCED'
        ]
      },
      wiaInput = {
        useCase: WiaInputUseCaseEnum.PARTICIPANT,
        income: null,
        products: [{
          "id": "WGA_EXCED",
          "label": "WGA-Excedentverzekering",
          "desc": "",
          "selected": false,
          "attrs": [
            {
              "id": "COVERAGE_RATE_WGA",
              "label": "Dekkingsgraad WGA",
              "value": 70,
              "visible": true,
              "options": [
                {
                  "value": 70,
                  "label": "70%"
                },
                {
                  "value": 75,
                  "label": "75%"
                },
                {
                  "value": 80,
                  "label": "80%"
                }
              ]
            },
            {
              "id": "END_AGE",
              "label": "EindLeeftijd",
              "value": 65,
              "visible": false,
              "options": [
                {
                  "value": 65,
                  "label": "65%"
                },
                {
                  "value": 67,
                  "label": "67%"
                },
                {
                  "value": 70,
                  "label": "70%"
                }
              ]
            },
            {
              "id": "BENEFIT_INDEX",
              "label": "Indexering uitkering (Klim_srt)",
              "value": "Geen",
              "visible": false,
              "options": [
                {
                  "value": "Geen",
                  "label": null
                },
                {
                  "value": "CBS",
                  "label": null
                },
                {
                  "value": "2%",
                  "label": null
                },
                {
                  "value": "3%",
                  "label": null
                }
              ]
            },
            {
              "id": "WAGE_DEFINITION",
              "label": "Loonbegrip",
              "value": "belastbaar loon boven de SV-loongrens",
              "visible": false,
              "options": [
                {
                  "value": "belastbaar loon boven de SV-loongrens",
                  "label": null
                },
                {
                  "value": "belastbaar loon boven de SV-loongrens",
                  "label": null
                }
              ]
            },
            {
              "id": "DEVIATED_MAXIMUM_WAGE",
              "label": "Afwijkend Maximum Loon(Afw_maxln)",
              "value": "125.000",
              "visible": false,
              "options": [
                {
                  "value": "125.000",
                  "label": null
                },
                {
                  "value": "meer dan 125.000",
                  "label": null
                }
              ]
            },
            {
              "id": "INSURED_AMOUNT",
              "label": "Verzekerd Bedrag (Verz_bedr)",
              "value": 0,
              "visible": false,
              "options": []
            }
          ]
        }]
      },
      expectedDescription = 'De aanvulling vanuit uw WGA-Excedentverzekering 70 berekenen wij over uw belastbaar loon boven de SV-loongrens tot en met € 125.000.';

    let actualDescription = productAttributesService.findAndReplaceAttributes(description, wiaInput);
    expect(actualDescription).toEqual(expectedDescription);
  });

  describe('should return the correct description for', () => {
    let description = require('./test-data/iva-wga-aanv-query-description.json');

    it('iva only input query', () => {
      let returnedDescription,
        ivaOnlyInput = require('./test-data/iva-only-input-query.json');

      returnedDescription = productAttributesService.findAndReplaceAttributes(description, ivaOnlyInput);
      expect(returnedDescription).toEqual('<p>IVA-Excedentverzekering <code>70%</code>.</p>');
    });

    it('wga only input query', () => {
      let returnedDescription,
        wgaOnlyInput = require('./test-data/wga-only-input-query.json');

      returnedDescription = productAttributesService.findAndReplaceAttributes(description, wgaOnlyInput);
      expect(returnedDescription).toEqual('<p>WGA-Excedentverzekering <code>70%</code>.</p>');
    });

    it('aanv only input query', () => {
      let returnedDescription,
        aanvOnlyInput = require('./test-data/aanv-only-input-query.json');

      returnedDescription = productAttributesService.findAndReplaceAttributes(description, aanvOnlyInput);
      expect(returnedDescription).toEqual('<p>WGA-Aanvullingsverzekering (light/upgrade).</p>');
    });

    it('iva and wga input query', () => {
      let returnedDescription,
        ivaAndWgaInput = require('./test-data/iva-and-wga-input-query.json');

      returnedDescription = productAttributesService.findAndReplaceAttributes(description, ivaAndWgaInput);
      expect(returnedDescription).toEqual('<p>IVA-Excedentverzekering <code>70%</code> en WGA-Excedentverzekering <code>70%</code>.</p>');
    });

    it('iva and aanv input query', () => {
      let returnedDescription,
        ivaAndAanvInput = require('./test-data/iva-and-aanv-input-query.json');

      returnedDescription = productAttributesService.findAndReplaceAttributes(description, ivaAndAanvInput);
      expect(returnedDescription).toEqual('<p>IVA-Excedentverzekering <code>70%</code> en WGA-Aanvullingsverzekering (light/upgrade).</p>');
    });

    it('iva, wga and aanv ', () => {
      let returnedDescription,
        ivaWgaAndAanvInput = require('./test-data/iva-wga-aanv-input-query.json');

      returnedDescription = productAttributesService.findAndReplaceAttributes(description, ivaWgaAndAanvInput);
      expect(returnedDescription).toEqual('<p>IVA-Excedentverzekering <code>70%</code>, WGA-Excedentverzekering <code>70%</code> en WGA-Aanvullingsverzekering (light/upgrade).</p>');
    });

  });

  describe('should return the correct description for', () => {
    let descriptionOne = require('./test-data/upgrade-query-description-one.json'),
      descriptionTwo = require('./test-data/upgrade-query-description-two.json'),
      wiaInputStandardOnly = require('./test-data/upgrade-input-standard-only.json'),
      wiaInputUpgradeOnly = require('./test-data/upgrade-input-upgrade-only.json');

    it('aanv standard query double', () => {
      let returnedDescription;

      returnedDescription = productAttributesService.findAndReplaceAttributes(descriptionOne, wiaInputStandardOnly);
      expect(returnedDescription).toEqual("<p>WGA-Aanvullingsverzekering.<br /> U kan langere tijd niet of minder werken. Dan komt uw inkomen in gevaar. Het UWV bepaalt hoeveel u nog wél kan werken en wat u daarmee nog kan verdienen. Dit noemen we uw ‘restverdiencapaciteit’. De hoogte van uw uitkering van het UWV hangt af van deze restverdiencapaciteit. En van wat u verdiende voordat u arbeidsongeschikt werd. Met de WGA-Aanvullingsverzekering krijgt u een uitkering als u volgens het UWV minimaal 35% arbeidsongeschikt bent, maar niet 80% of meer.</p>");
    });

    it('aanv upgrade query double', () => {
      let returnedDescription;

      returnedDescription = productAttributesService.findAndReplaceAttributes(descriptionOne, wiaInputUpgradeOnly);
      expect(returnedDescription).toEqual("<p>WGA-Aanvullingsverzekering upgrade.<br /> U kan langere tijd niet of minder werken. Dan komt uw inkomen in gevaar. Het UWV bepaalt hoeveel u nog wél kan werken en wat u daarmee nog kan verdienen. Dit noemen we uw ‘restverdiencapaciteit’. De hoogte van uw uitkering van het UWV hangt af van deze restverdiencapaciteit. En van wat u verdiende voordat u arbeidsongeschikt werd. Met de WGA-Aanvullingsverzekering upgrade krijgt u een uitkering als u volgens het UWV minimaal 35% arbeidsongeschikt bent, maar niet 80% of meer.</p>");
    });

    it('aanv standard query', () => {
      let returnedDescription;

      returnedDescription = productAttributesService.findAndReplaceAttributes(descriptionTwo, wiaInputStandardOnly);
      expect(returnedDescription).toEqual("<p>Met de WGA-Aanvullingsverzekering krijgt u een uitkering als u volgens het UWV minimaal 35% arbeidsongeschikt bent, maar niet 80% of meer.</p>");
    });

    it('aanv upgrade query', () => {
      let returnedDescription;

      returnedDescription = productAttributesService.findAndReplaceAttributes(descriptionTwo, wiaInputUpgradeOnly);
      expect(returnedDescription).toEqual("<p>Met de WGA-Aanvullingsverzekering upgrade krijgt u een uitkering als u volgens het UWV minimaal 35% arbeidsongeschikt bent, maar niet 80% of meer.</p>");
    });

  });

  describe('should return the correct description for', () => {
    let description = require('./test-data/coverage-rate-queries-description.json'),
        input = require('./test-data/coverage-rate-queries-input.json');

    it('iva exced coverage rate first case', () => {
      let returnedDescription,
          wiaInput = input.IVA_INPUT;
          wiaInput.useCase = WiaInputUseCaseEnum.PARTICIPANT;

      returnedDescription = productAttributesService.findAndReplaceAttributes(description.IVA_EXCED_ONE, wiaInput);
      expect(returnedDescription).toEqual("<p>IVA-Excedentverzekering<code> 70%</code>. Met de IVA-Excedentverzekering krijgt u een uitkering als u volgens het UWV minimaal 80% duurzaam arbeidsongeschikt bent.</p>");

    });

    it('iva exced coverage rate first case different product', () => {
      let returnedDescription;

      returnedDescription = productAttributesService.findAndReplaceAttributes(description.IVA_EXCED_ONE, input.IVA_INPUT_NON_PARTICIPANT);
      expect(returnedDescription).toEqual("<p>IVA-Excedentverzekering. Met de IVA-Excedentverzekering krijgt u een uitkering als u volgens het UWV minimaal 80% duurzaam arbeidsongeschikt bent.</p>");

    });

    it('iva exced coverage rate second case', () => {
      let returnedDescription;

      returnedDescription = productAttributesService.findAndReplaceAttributes(description.IVA_EXCED_TWO, input.IVA_INPUT);
      expect(returnedDescription).toEqual("<p>IVA-Excedentverzekering<code> 70%</code>.<br /> U kan niet meer werken. Volgens het UWV bent u 80% of meer arbeidsongeschikt. Verder denkt het UWV niet dat u in de komende vijf jaar weer kan gaan werken. U krijgt daarom een IVA-uitkering. De hoogte van de IVA-uitkering van het UWV is 75% van uw salaris voordat u arbeidsongeschikt werd. Verdiende u voordat u arbeidsongeschikt werd meer dan de loongrens voor de sociale verzekeringen (2016: € 52.766,37)? Dan krijgt u voor het loon boven die loongrens geen uitkering van het UWV. Met de IVA-Excedentverzekering krijgt u dan wel een uitkering voor het loon boven die loongrens.</p>");
    });

    it('iva exced coverage rate third case', () => {
      let returnedDescription;

      returnedDescription = productAttributesService.findAndReplaceAttributes(description.IVA_EXCED_THREE, input.IVA_INPUT);
      expect(returnedDescription).toEqual("<p>Deze regeling geeft een aanvulling op uw IVA-uitkering. De aanvulling vanuit uw IVA-Excedentverzekering<code> 70%</code> berekenen wij over uw <code>belastbaar loon boven de SV-loongrens</code> tot en met € <code>125.000,-</code>. Uw uitkering stopt als u de AOW-leeftijd bereikt of nog daarvoor <code>65</code> jaar wordt.</p>");
    });

    it('iva exced coverage rate third case different product', () => {
      let returnedDescription;

      returnedDescription = productAttributesService.findAndReplaceAttributes(description.IVA_EXCED_THREE, input.WGA_INPUT_NON_PARTICIPANT);
      expect(returnedDescription).toEqual("<p>Deze regeling geeft een aanvulling op uw IVA-uitkering. De aanvulling vanuit uw IVA-Excedentverzekering berekenen wij over uw <code>%WAGE_DEFINITION%</code> tot en met € <code>%DEVIATED_MAXIMUM_WAGE%,-</code>. Uw uitkering stopt als u de AOW-leeftijd bereikt of nog daarvoor <code>%END_AGE%</code> jaar wordt.</p>");
    });

    it('iva exced coverage rate fourth case', () => {
      let returnedDescription;

      returnedDescription = productAttributesService.findAndReplaceAttributes(description.IVA_EXCED_FOUR, input.IVA_INPUT);
      expect(returnedDescription).toEqual("<p>De aanvulling vanuit uw IVA-Excedentverzekering<code> 70%</code> berekenen wij over uw <code>belastbaar loon boven de SV-loongrens</code> tot en met € <code>125.000,-</code>.</p>");
    });

    it('wga exced coverage rate first case', () => {
      let returnedDescription,
          wiaInput = input.WGA_INPUT;
          wiaInput.useCase = WiaInputUseCaseEnum.PARTICIPANT;

      returnedDescription = productAttributesService.findAndReplaceAttributes(description.WGA_EXCED_ONE, input.WGA_INPUT);
      expect(returnedDescription).toEqual("<p>WGA-Excedentverzekering<code> 70%</code>. Met de WGA-Excedentverzekering krijgt u een uitkering als u volgens het UWV minimaal 35% arbeidsongeschikt bent, maar niet minimaal 80% duurzaam.</p>");
    });

    it('wga exced coverage rate second case', () => {
      let returnedDescription;

      returnedDescription = productAttributesService.findAndReplaceAttributes(description.WGA_EXCED_TWO, input.WGA_INPUT);
      expect(returnedDescription).toEqual("<p>WGA-Excedentverzekering<code> 70%</code>.<br /> U kan langere tijd niet of minder werken. U krijgt daarom een WGA-uitkering van het UWV. Verdiende u voordat u arbeidsongeschikt werd meer dan de loongrens voor de sociale verzekeringen (2016: € 52.766,37)? Dan krijgt u voor het loon boven die loongrens geen uitkering van het UWV. Met de WGA-Excedentverzekering krijgt u dan wel een uitkering voor het loon boven die loongrens.</p>");
    });

    it('wga exced coverage rate third case', () => {
      let returnedDescription;

      returnedDescription = productAttributesService.findAndReplaceAttributes(description.WGA_EXCED_THREE, input.WGA_INPUT);
      expect(returnedDescription).toEqual("De aanvulling vanuit uw WGA-Excedentverzekering<code> 70%</code> berekenen wij over uw <code>belastbaar loon boven de SV-loongrens</code> tot en met € <code>125.000,-</code>.");
    });

    it('wga exced coverage rate fourth case', () => {
      let returnedDescription;

      returnedDescription = productAttributesService.findAndReplaceAttributes(description.WGA_EXCED_FOUR, input.WGA_INPUT);
      expect(returnedDescription).toEqual("De aanvulling vanuit uw WGA-Excedentverzekering<code> 70%</code> berekenen wij over uw <code>belastbaar loon boven de SV-loongrens</code> tot en met € <code>125.000,-</code>.");
    });
  });

});
