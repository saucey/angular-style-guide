/**
 * TopicServiceSpec created on 10/25/16 8:50 AM.
 *
 * @description Tests the behaviour exposed by TopicService
 * @author Florian Popa <florian@webgenerals.com>
 */

import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { TopicService } from "../topic.service";
import { WiaContentService } from "../wia-content.service";
import { TopicBuilder } from "../topic-builder";
import { WiaPageService } from "../../wia-page/wia-page.service";
import { BehaviorSubject } from "rxjs";
import { WIAInputEntity } from "../../wia-page/models/wia-input.entity";
import { TopicRowEntity } from "../topic-entities/topic-row.entity";

describe('TopicServiceSpec', () => {

  const DEFAULT_WIA_INPUT = {
    income: null,
    productsIds: [],
    products: []
  };

  const TOPICS_LIST = [
    {
      title: 'one',
      topics: []
    }
  ];

  class WiaContentServiceMock {

    public getWiaContent() {
      return [];
    }

  }

  class WiaPageServiceMock {

    public externalInput$: BehaviorSubject<WIAInputEntity>;

    constructor() {
      this.externalInput$ = new BehaviorSubject(DEFAULT_WIA_INPUT);
    }

  }

  class TopicBuilderMock {

    public withWiaInputData(productIncomeData: WIAInputEntity): void {}

    public withWiaContent(wiaContent): void {}

    public build(): Array<TopicRowEntity> {
      return TOPICS_LIST;
    }

  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TopicService,
        {
          provide: WiaContentService,
          useClass: WiaContentServiceMock
        },
        {
          provide: WiaPageService,
          useClass: WiaPageServiceMock
        },
        {
          provide: TopicBuilder,
          useClass: TopicBuilderMock
        }
      ]
    });
  });

  it('should return a list of topics', inject([TopicService, WiaContentService, TopicBuilder], (topicService: TopicService, wiaContentServiceMock: WiaContentService, topicBuilderMock: TopicBuilder) => {

    spyOn(wiaContentServiceMock, 'getWiaContent');
    spyOn(topicBuilderMock, 'withWiaContent');
    spyOn(topicBuilderMock, 'withWiaInputData');

    let topicsList = topicService.getTopics();

    expect(topicBuilderMock.withWiaInputData).toHaveBeenCalledWith(DEFAULT_WIA_INPUT);
    expect(wiaContentServiceMock.getWiaContent).toHaveBeenCalled();
    expect(topicBuilderMock.withWiaContent).toHaveBeenCalled();
    expect(topicsList).toEqual(TOPICS_LIST);
  }));

});
