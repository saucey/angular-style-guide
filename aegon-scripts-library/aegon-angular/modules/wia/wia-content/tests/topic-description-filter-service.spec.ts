import { WiaInputUseCaseEnum } from "../../wia-page/models/wia-input-use-case.enum";
import { TopicDescriptionFilterService } from "../topic-description-filter.service";
/**
 * TopicDescriptionFilterServiceSpec created on 10/27/16 10:38 AM.
 *
 * @description Tests the behaviour of TopicDescriptionFilterService
 * @author Florian Popa <florian@webgenerals.com>
 */

describe('TopicDescriptionFilterServiceSpec', () => {

  let topicDescriptionFilterService: TopicDescriptionFilterService;

  beforeEach(() => {
     topicDescriptionFilterService = new TopicDescriptionFilterService();
  });

  it('should match the filters in the default case', () => {
    let descriptionFilter = {
      "filter": [
        "IVA_EXCED"
      ],
      "text": "<p>IVA-Excedentverzekering <code>%COVERAGE_RATE_IVA%</code>. Met de IVA-Excedentverzekering krijgt u een uitkering als u volgens het UWV minimaal 80% duurzaam arbeidsongeschikt bent.</p>"
    };
    let wiaInputData = {
      useCase: WiaInputUseCaseEnum.DEFAULT,
      income: null,
      products: []
    };

    let matchFilter = topicDescriptionFilterService.matchesFilters(descriptionFilter, wiaInputData);
    expect(matchFilter).toBeTruthy();
  });

  it('should match filters in the user case to true', () => {
    let descriptionFilter = {
      "filter": [
        "WGA_AANV_STANDARD",
        "WGA_AANV_UPGRADE"
      ],
      "text": "<p>IVA-Excedentverzekering <code>%COVERAGE_RATE_IVA%</code>.</p>"
    };
    let wiaInputData = {
      useCase: WiaInputUseCaseEnum.USER,
      income: null,
      products: [
        {
          "id": "WGA_AANV_STANDARD",
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
        },
        {
          "id": "WGA_AANV_UPGRADE",
          "label": "WGA_AANV_UPGRADE",
          "desc": "",
          "selected": false,
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
      ]
    };

    let matchFilter = topicDescriptionFilterService.matchesFilters(descriptionFilter, wiaInputData);
    expect(matchFilter).toBeTruthy();
  });

  it('should match filters in the user case to false', () => {
    let descriptionFilter = {
      "filter": [
        "WGA_AANV_STANDARD",
        "WGA_AANV_UPGRADE"
      ],
      "text": "<p>IVA-Excedentverzekering <code>%COVERAGE_RATE_IVA%</code>.</p>"
    };
    let wiaInputData = {
      useCase: WiaInputUseCaseEnum.USER,
      income: null,
      products: []
    };

    let matchFilter = topicDescriptionFilterService.matchesFilters(descriptionFilter, wiaInputData);
    expect(matchFilter).toBeFalsy();
  });

  it('should match filters in the participant case to true', () => {
    let descriptionFilter = {
      "filter": [
        "WGA_AANV_STANDARD",
        "WGA_AANV_UPGRADE"
      ],
      "text": "<p>IVA-Excedentverzekering <code>%COVERAGE_RATE_IVA%</code>.</p>"
    };
    let wiaInputData = {
      useCase: WiaInputUseCaseEnum.PARTICIPANT,
      income: null,
      products: [
        {
          "id": "WGA_AANV_STANDARD",
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
        },
        {
          "id": "WGA_AANV_UPGRADE",
          "label": "WGA_AANV_UPGRADE",
          "desc": "",
          "selected": false,
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
      ]
    };

    let matchFilter = topicDescriptionFilterService.matchesFilters(descriptionFilter, wiaInputData);
    expect(matchFilter).toBeTruthy();
  });

  it('should match filters in the participant case to false', () => {
    let descriptionFilter = {
      "filter": [
        "WGA_AANV_STANDARD",
        "WGA_AANV_UPGRADE"
      ],
      "text": "<p>IVA-Excedentverzekering <code>%COVERAGE_RATE_IVA%</code>.</p>"
    };
    let wiaInputData = {
      useCase: WiaInputUseCaseEnum.PARTICIPANT,
      income: null,
      products: []
    };

    let matchFilter = topicDescriptionFilterService.matchesFilters(descriptionFilter, wiaInputData);
    expect(matchFilter).toBeFalsy();
  });

  it('shoud match the use case for participant', () => {
    let descriptionFilter = {
      "useCase": [
        "PARTICIPANT",
      ],
      "filter": [],
      "text": ""
    };

    let wiaInputData = {
      useCase: WiaInputUseCaseEnum.PARTICIPANT,
      income: null,
      products: []
    };

    let matchUseCase = topicDescriptionFilterService.matchesFilters(descriptionFilter, wiaInputData);
    expect(matchUseCase).toBeTruthy();
  });

  it('should match the use case for user', () => {
    let descriptionFilter = {
      "useCase": [
        "USER",
      ],
      "filter": [],
      "text": ""
    };

    let wiaInputData = {
      useCase: WiaInputUseCaseEnum.USER,
      income: null,
      products: []
    };

    let matchUseCase = topicDescriptionFilterService.matchesFilters(descriptionFilter, wiaInputData);
    expect(matchUseCase).toBeTruthy();
  });

  it('should match the use case for default', () => {
    let descriptionFilter = {
      "useCase": [
        "DEFAULT",
      ],
      "filter": [],
      "text": ""
    };

    let wiaInputData = {
      useCase: WiaInputUseCaseEnum.DEFAULT,
      income: null,
      products: []
    };

    let matchUseCase = topicDescriptionFilterService.matchesFilters(descriptionFilter, wiaInputData);
    expect(matchUseCase).toBeTruthy();
  });

  it('should not filter the description by default', () => {
    let descriptionFilter = {
      "useCase": [
        "DEFAULT",
      ],
      "filter": [
        "WGA_AANV_STANDARD",
        "WGA_AANV_UPGRADE"
      ],
      "text": ""
    };

    let wiaInputData = {
      useCase: WiaInputUseCaseEnum.DEFAULT,
      income: null,
      products: []
    };

    let matchUseCase = topicDescriptionFilterService.isDescriptionFiltered(descriptionFilter, wiaInputData);
    expect(matchUseCase).toBeFalsy();
  });

});
