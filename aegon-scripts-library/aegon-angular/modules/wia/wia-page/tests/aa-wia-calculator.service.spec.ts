import { WiaPagePersonalizationService } from "../wia-page.personalization.service";
import { WiaInputUseCaseEnum } from "../../wia-content/enums/wia-input-use-case.enum";

describe('CalculatorProductService', () => {

  let wiaPagePersonalizationService: WiaPagePersonalizationService;

  const cases = [
    {
      label: 'works for basicInputNoProducts',
      input: {
        useCase: WiaInputUseCaseEnum.PARTICIPANT,
        income: 5000,
        disability: 50,
        usage: 50,
        permDisability: false,
        products: [],
        productsIds: []
      },
      code: '05500'
    },
    {
      label: 'works for basicInputNoProducts #2',
      input: {
        useCase: WiaInputUseCaseEnum.PARTICIPANT,
        income: 35000,
        disability: 100,
        usage: 50,
        permDisability: true,
        products: [],
        productsIds: []
      },
      code: '3AP00'
    },
    {
      label: 'works for IVA_EXCED',
      input: {
        useCase: WiaInputUseCaseEnum.PARTICIPANT,
        income: 35000,
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
      code: '3AP10'
    },
    {
      label: 'works for WGA_EXCED',
      input: {
        useCase: WiaInputUseCaseEnum.PARTICIPANT,
        income: 35000,
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
      code: '3APA0'
    },
    {
      label: 'works for IVA_EXCED with non default coverage',
      input: {
        useCase: WiaInputUseCaseEnum.PARTICIPANT,
        income: 35000,
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
      code: '3AP30'
    },
    {
      label: 'works for IVA_EXCED and WGA_EXCED',
      input: {
        useCase: WiaInputUseCaseEnum.PARTICIPANT,
        income: 35000,
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
      code: '3APB0'
    },
    {
      label: 'works for WIA_35MIN_BODEM',
      input: {
        useCase: WiaInputUseCaseEnum.PARTICIPANT,
        income: 35000,
        disability: 100,
        usage: 50,
        permDisability: true,
        products: [
          {
            id: 'WIA_35MIN_BODEM',
            attrs: []
          }
        ],
        productsIds: ['WIA_35MIN_BODEM']
      },
      code: '3AP01'
    },
    {
      label: 'works for WIA_35MIN',
      input: {
        useCase: WiaInputUseCaseEnum.PARTICIPANT,
        income: 35000,
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
      code: '3AP03'
    },
    {
      label: 'works for edge values',
      input: {
        useCase: WiaInputUseCaseEnum.PARTICIPANT,
        income: 125000,
        disability: 100,
        usage: 100,
        permDisability: false,
        products: [],
        productsIds: []
      },
      code: 'CAA00'
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

  })

});