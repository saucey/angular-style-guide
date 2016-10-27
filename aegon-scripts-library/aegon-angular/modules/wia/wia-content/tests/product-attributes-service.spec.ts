import { ProductAttributesService } from "../product-attributes.service";
import { WiaInputUseCaseEnum } from "../../wia-page/models/wia-input-use-case.enum";
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
    let descriptionText = 'De aanvulling vanuit uw WGA-Excedentverzekering %COVERAGE_RATE_WGA% berekenen wij over uw %WAGE_DEFINITION% tot en met € %DEVIATED_MAXIMUM_WAGE%.',
        filterList = [
          'WGA_EXCED'
        ],
        wiaInput = {
          useCase: WiaInputUseCaseEnum.DEFAULT,
          income: null,
          products: []
        },
        expectedDescription = 'De aanvulling vanuit uw WGA-Excedentverzekering  berekenen wij over uw  tot en met € .';

    let actualDescription = productAttributesService.findAndReplaceAttributes(descriptionText, filterList, wiaInput);
    expect(actualDescription).toEqual(expectedDescription);
  });

  it('should remove the attributes when in the user case', () => {
    let descriptionText = 'De aanvulling vanuit uw WGA-Excedentverzekering %COVERAGE_RATE_WGA% berekenen wij over uw %WAGE_DEFINITION% tot en met € %DEVIATED_MAXIMUM_WAGE%.',
      filterList = [
        'WGA_EXCED'
      ],
      wiaInput = {
        useCase: WiaInputUseCaseEnum.USER,
        income: null,
        products: []
      },
      expectedDescription = 'De aanvulling vanuit uw WGA-Excedentverzekering  berekenen wij over uw  tot en met € .';

    let actualDescription = productAttributesService.findAndReplaceAttributes(descriptionText, filterList, wiaInput);
    expect(actualDescription).toEqual(expectedDescription);
  });

  it('should not replace the attributes if the products do not match', () => {
    let descriptionText = 'De aanvulling vanuit uw WGA-Excedentverzekering %COVERAGE_RATE_WGA% berekenen wij over uw %WAGE_DEFINITION% tot en met € %DEVIATED_MAXIMUM_WAGE%.',
      filterList = [
        'WGA_EXCED'
      ],
      wiaInput = {
        useCase: WiaInputUseCaseEnum.PARTICIPANT,
        income: null,
        products: []
      },
      expectedDescription = 'De aanvulling vanuit uw WGA-Excedentverzekering %COVERAGE_RATE_WGA% berekenen wij over uw %WAGE_DEFINITION% tot en met € %DEVIATED_MAXIMUM_WAGE%.';

    let actualDescription = productAttributesService.findAndReplaceAttributes(descriptionText, filterList, wiaInput);
    expect(actualDescription).toEqual(expectedDescription);
  });

  it('should not replace the attributes if the products do not match', () => {
    let descriptionText = 'De aanvulling vanuit uw WGA-Excedentverzekering %COVERAGE_RATE_WGA% berekenen wij over uw %WAGE_DEFINITION% tot en met € %DEVIATED_MAXIMUM_WAGE%.',
      filterList = [
        'WGA_EXCED'
      ],
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

    let actualDescription = productAttributesService.findAndReplaceAttributes(descriptionText, filterList, wiaInput);
    expect(actualDescription).toEqual(expectedDescription);
  });

  it('should not replace the attributes if the products do not match', () => {
    let descriptionText = 'De aanvulling vanuit uw WGA-Excedentverzekering %COVERAGE_RATE_WGA% berekenen wij over uw %WAGE_DEFINITION% tot en met € %DEVIATED_MAXIMUM_WAGE%.',
      filterList = [
        'WGA_EXCED'
      ],
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

    let actualDescription = productAttributesService.findAndReplaceAttributes(descriptionText, filterList, wiaInput);
    expect(actualDescription).toEqual(expectedDescription);
  });

});
