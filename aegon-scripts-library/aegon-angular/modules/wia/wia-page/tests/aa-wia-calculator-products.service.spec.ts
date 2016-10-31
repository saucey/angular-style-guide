import { WiaPageProductsService } from "../wia-page.products.service";

describe('CalculatorProductService', () => {

  let productService: WiaPageProductsService;

  beforeEach(() => {
    productService = new WiaPageProductsService();

    productService.setProductConfigurations([
      ['1', '2', '3'],
      ['1', '2', '4'],
      ['1', '5']
    ]);
  });

  describe('getProductsConfigurations', () => {

    it('is defined', () => {
      expect(productService.getProductsConfigurations).toBeDefined();
    });

    it('gives correct results for given array with strings', () => {
      expect(productService.getProductsConfigurations([
        ['1', '2', '3']
      ])).toEqual(
        [
          ['1', '2', '3']
        ]
      );
    });

    it('gives correct results for given array with an array', () => {
      expect(productService.getProductsConfigurations([
        ['1', ['2', '3']]
      ])).toEqual(
        [
          ['1', '2'],
          ['1', '3']
        ]
      );
    });

    it('gives correct results for for given array with arrays', () => {
      expect(productService.getProductsConfigurations([
        ['1', ['2', '3'], ['4', '5', '6'], '7']
      ])).toEqual(
        [
          ['1', '2', '4', '7'],
          ['1', '2', '5', '7'],
          ['1', '2', '6', '7'],
          ['1', '3', '4', '7'],
          ['1', '3', '5', '7'],
          ['1', '3', '6', '7']
        ]
      );
    });


    it('gives correct results for given array with arrays only', () => {
      expect(productService.getProductsConfigurations([
        [['1', '2']]
      ])).toEqual(
        [
          ['1'],
          ['2']
        ]
      );
    });

  });

  describe('getAvailableProducts', () => {

    it('is defined', () => {
      expect(productService.getAvailableProducts).toBeDefined();
    });

    it('gives all products when there is nothing already selected', () => {

      expect(productService.getAvailableProducts([])).toEqual(['1', '2', '3', '4', '5']);
    });

    it('gives only available for one selected', () => {

      // If we selected product "3" we can only select products 1,2 (1st set)
      // we cannot select product "4", because there is no combination in which 3 and 4 are together
      expect(productService.getAvailableProducts(['3'])).toEqual(['1', '2', '3']);
    });

    it('gives only available for one selected, which is in mutiple combinations', () => {

      expect(productService.getAvailableProducts(['1'])).toEqual(['1', '2', '3', '4', '5']);
    });

    it('gives only available for multiple selected', () => {

      expect(productService.getAvailableProducts(['1', '3'])).toEqual(['1', '2', '3']);
    });
  });

  describe('setDefaultAttributes', () => {

    it('should add the missing attributes for WGA_EXCED', () => {
      let productsList = [
          {
            "id": "WGA_EXCED",
            "attrs": [
              {
                "id": "COVERAGE_RATE_WGA",
                "value": 70
              }
            ]
          }
        ],
        expectedProductsList = [
          {
            "id": "WGA_EXCED",
            "attrs": [
              {
                "id": "COVERAGE_RATE_WGA",
                "value": 70
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
          }
        ],
        actualProductsList;

      actualProductsList = productService.setDefaultAttributes(productsList);
      expect(actualProductsList).toEqual(expectedProductsList);
    });

    it('should add the missing attributes for IVA_EXCED and WGA_AANV_UPGRADE', () => {
      let productsList = [
          {
            "id": "IVA_EXCED",
            "attrs": [
              {
                "id": "COVERAGE_RATE_IVA",
                "value": 70
              }
            ]
          },
          {
            "id": "WGA_AANV_UPGRADE",
            "attrs": []
          }
        ],
        expectedProductsList = [
          {
            "id": "IVA_EXCED",
            "attrs": [
              {
                "id": "COVERAGE_RATE_IVA",
                "value": 70
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
          },
          {
            "id": "WGA_AANV_UPGRADE",
            "attrs": [
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
              }
            ]
          }
        ],
        actualProductsList;

      actualProductsList = productService.setDefaultAttributes(productsList);
      expect(actualProductsList).toEqual(expectedProductsList);
    });

    it('should add the missing attributes for WGA_AANV_LIGHT and WGA_AANV_STANDARD', () => {
      let productsList = [
          {
            "id": "WGA_AANV_LIGHT",
            "attrs": [
              {
                "id": "END_AGE",
                "value": 65
              }
            ]
          },
          {
            "id": "WGA_AANV_STANDARD",
            "attrs": [
              {
                "id": "END_AGE",
                "value": 65
              }
            ]
          }
        ],
        expectedProductsList = [
          {
            "id": "WGA_AANV_LIGHT",
            "attrs": [
              {
                "id": "END_AGE",
                "value": 65
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
              }
            ]
          },
          {
            "id": "WGA_AANV_STANDARD",
            "attrs": [
              {
                "id": "END_AGE",
                "value": 65
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
              }
            ]
          }
        ],
        actualProductsList;

      actualProductsList = productService.setDefaultAttributes(productsList);
      expect(actualProductsList).toEqual(expectedProductsList);
    });

    it('should add the missing attributes for WIA_35MIN and WIA_35MIN_BODEM', () => {
      let productsList = [
          {
            "id": "WIA_35MIN",
            "attrs": []
          },
          {
            "id": "WIA_35MIN_BODEM",
            "attrs": []
          }
        ],
        expectedProductsList = [
          {
            "id": "WIA_35MIN",
            "attrs": [
              {
                "id": "BENEFIT_PERIOD",
                "label": "Selecteer uitkeringsduur",
                "value": 5,
                "visible": true,
                "options": [
                  {
                    "value": 5,
                    "label": "5%"
                  },
                  {
                    "value": 7.5,
                    "label": "7.5%"
                  },
                  {
                    "value": 10,
                    "label": "10%"
                  }
                ]
              }
            ]
          },
          {
            "id": "WIA_35MIN_BODEM",
            "attrs": [
              {
                "id": "BENEFIT_PERIOD",
                "label": "Selecteer uitkeringsduur",
                "value": 5,
                "visible": false,
                "options": [
                  {
                    "value": 5,
                    "label": "5"
                  },
                  {
                    "value": 7.5,
                    "label": "7.5"
                  },
                  {
                    "value": 10,
                    "label": "10"
                  }
                ]
              }
            ]
          }
        ],
        actualProductsList;

      actualProductsList = productService.setDefaultAttributes(productsList);
      expect(actualProductsList).toEqual(expectedProductsList);
    });

  });

});
