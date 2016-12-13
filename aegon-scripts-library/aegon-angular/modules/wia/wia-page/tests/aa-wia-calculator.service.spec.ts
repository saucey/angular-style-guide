import { WiaPagePersonalizationService } from "../wia-page.personalization.service";
import { WiaInputUseCaseEnum } from "../../wia-content/enums/wia-input-use-case.enum";

describe('CalculatorProductService', () => {

  let wiaPagePersonalizationService: WiaPagePersonalizationService;

  const cases = [
    {
      label: 'works for basicInputNoProducts #1',
      input: {
        useCase: WiaInputUseCaseEnum.USER,
        income: 15000,
        disability: 5,
        usage: 5,
        permDisability: false,
        products: [],
        productsIds: []
      },
      code: '01100'
    },
    {
      label: 'works for basicInputNoProducts #2',
      input: {
        useCase: WiaInputUseCaseEnum.USER,
        income: 15000,
        disability: 50,
        usage: 50,
        permDisability: false,
        products: [],
        productsIds: []
      },
      code: '0AA00'
    },
    {
      label: 'works for basicInputNoProducts #3',
      input: {
        useCase: WiaInputUseCaseEnum.USER,
        income: 45000,
        disability: 100,
        usage: 50,
        permDisability: true,
        products: [],
        productsIds: []
      },
      code: '2KP00'
    },
    {
      label: 'works for IVA_EXCED',
      input: {
        useCase: WiaInputUseCaseEnum.USER,
        income: 45000,
        disability: 100,
        usage: 50,
        permDisability: true,
        products: [
          {
            id: 'IVA_EXCED',
            attrs: [
              {
                id: 'COVERAGE_RATE_IVA',
                value: 70
              }
            ]
          }
        ],
        productsIds: ['IVA_EXCED']
      },
      code: '2KP10'
    },
    {
      label: 'works for WGA_EXCED',
      input: {
        useCase: WiaInputUseCaseEnum.USER,
        income: 45000,
        disability: 100,
        usage: 50,
        permDisability: true,
        products: [
          {
            id: 'WGA_EXCED',
            attrs: [
              {
                id: 'COVERAGE_RATE_WGA',
                value: 70
              }
            ]
          }
        ],
        productsIds: ['WGA_EXCED']
      },
      code: '2KPA0'
    },
    {
      label: 'works for IVA_EXCED with non default coverage',
      input: {
        useCase: WiaInputUseCaseEnum.USER,
        income: 45000,
        disability: 100,
        usage: 50,
        permDisability: true,
        products: [
          {
            id: 'IVA_EXCED',
            attrs: [
              {
                id: 'COVERAGE_RATE_IVA',
                value: 80
              }
            ]
          }
        ],
        productsIds: ['IVA_EXCED']
      },
      code: '2KP30'
    },
    {
      label: 'works for IVA_EXCED and WGA_EXCED',
      input: {
        useCase: WiaInputUseCaseEnum.USER,
        income: 45000,
        disability: 100,
        usage: 50,
        permDisability: true,
        products: [
          {
            id: 'WGA_EXCED',
            attrs: [
              {
                id: 'COVERAGE_RATE_WGA',
                value: 70
              }
            ]
          },
          {
            id: 'IVA_EXCED',
            attrs: [
              {
                id: 'COVERAGE_RATE_IVA',
                value: 70
              }
            ]
          }
        ],
        productsIds: ['WGA_EXCED', 'IVA_EXCED']
      },
      code: '2KPB0'
    },
    {
      label: 'works for WIA_BODEM',
      input: {
        useCase: WiaInputUseCaseEnum.USER,
        income: 45000,
        disability: 100,
        usage: 50,
        permDisability: true,
        products: [
          {
            id: 'WIA_BODEM',
            attrs: []
          }
        ],
        productsIds: ['WIA_BODEM']
      },
      code: '2KP01'
    },
    {
      label: 'works for WIA_35MIN',
      input: {
        useCase: WiaInputUseCaseEnum.USER,
        income: 45000,
        disability: 100,
        usage: 50,
        permDisability: true,
        products: [
          {
            id: 'WIA_35MIN',
            attrs: [
              {
                id: 'BENEFIT_PERIOD',
                value: 7.5
              }
            ]
          }
        ],
        productsIds: ['WIA_35MIN']
      },
      code: '2KP03'
    },
    {
      label: 'works for edge values',
      input: {
        useCase: WiaInputUseCaseEnum.USER,
        income: 510000,
        disability: 100,
        usage: 100,
        permDisability: false,
        products: [],
        productsIds: []
      },
      code: 'XKK00'
    }
  ];

  beforeEach(() => {
    wiaPagePersonalizationService = new WiaPagePersonalizationService();
  });


  describe('inputToCode', () => {

    cases.forEach((testCase) => {

      it(testCase.label, () => {

        expect(wiaPagePersonalizationService.inputToCode(testCase.input)).toEqual(testCase.code);
      });
    });

  });

  describe('codeToInput', () => {

    cases.forEach(({label, input, code}) => {

      it(label, () => {

        expect(wiaPagePersonalizationService.codeToInput(code)).toEqual(input);
      });
    });


    it('converts personalized code to input', () => {

      expect(wiaPagePersonalizationService.codeToInput('3AP10P')).toEqual({
        useCase: WiaInputUseCaseEnum.PARTICIPANT,
        income: 60000,
        disability: 50,
        usage: 50,
        permDisability: true,
        products: [
          {
            id: 'IVA_EXCED',
            attrs: [
              {
                id: 'COVERAGE_RATE_IVA',
                value: 70
              }
            ]
          }
        ],
        productsIds: ['IVA_EXCED']
      });
    });

  })

});
