/**
 * TopicService created on 10/17/16 1:32 PM.
 *
 * @description Retrieve and adapt topic related data to be used in component
 * @author Florian Popa <florian@webgenerals.com>
 */

import { Injectable } from "@angular/core";
import { WiaContentService } from "./wia-content.service";
import { WiaPageService } from "../wia-page/wia-page.service";
import { WIAInputEntity } from "../wia-page/wia-input.entity";
import { TopicBuilder } from "./topic-builder";
import { TopicRowEntity } from "./topic-entities/topic-row.entity";

@Injectable()
export class TopicService {

  private wiaContentService: WiaContentService;
  private productIncomeData: WIAInputEntity;
  private topicBuilder: TopicBuilder;

  constructor(wiaContentService: WiaContentService, wiaPageService: WiaPageService, topicBuilder: TopicBuilder) {
    this.wiaContentService = wiaContentService;
    this.topicBuilder = topicBuilder;

    wiaPageService.externalInput$.subscribe(value => {
      this.productIncomeData = value;
    });
  }


  /**
   *
   * @returns {Array<TopicRowEntity>}
   */
  getTopics(): TopicRowEntity[] {
    this
      .topicBuilder
      .withProductIncomeData(this.productIncomeData);

    let wiaContent = this
      .wiaContentService
      .getWiaContent();

    console.log(wiaContent, this.productIncomeData);

    this
      .topicBuilder
      .withWiaContent(wiaContent);

    let topicsCollection = this
      .topicBuilder
      .build();

    return topicsCollection;
  }

}
