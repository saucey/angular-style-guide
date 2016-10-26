import { TopicBuilder } from "../topic-builder";
import { WiaInputUseCaseEnum } from "../../wia-page/models/wia-input-use-case.enum";
/**
 * TopicBuilderSpec created on 10/27/16 10:38 AM.
 *
 * @description Tests the behaviour of TopicBuilder
 * @author Florian Popa <florian@webgenerals.com>
 */

describe('TopicBuilderSpec', () => {

  let topicBuilder: TopicBuilder;

  beforeEach(() => {
     topicBuilder = new TopicBuilder();
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

    topicBuilder.withWiaInputData(wiaInputData);
    let matchFilter = topicBuilder.matchesFilters(descriptionFilter);
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

    topicBuilder.withWiaInputData(wiaInputData);
    let matchFilter = topicBuilder.matchesFilters(descriptionFilter);
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

    topicBuilder.withWiaInputData(wiaInputData);
    let matchFilter = topicBuilder.matchesFilters(descriptionFilter);
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

    topicBuilder.withWiaInputData(wiaInputData);
    let matchFilter = topicBuilder.matchesFilters(descriptionFilter);
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

    topicBuilder.withWiaInputData(wiaInputData);
    let matchFilter = topicBuilder.matchesFilters(descriptionFilter);
    expect(matchFilter).toBeFalsy();
  });

  // add tests without filter

});
