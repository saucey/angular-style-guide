/**
 * TopicService created on 10/17/16 1:32 PM.
 *
 * @description Retrieve and adapt topic related data to be used in component
 * @author Florian Popa <florian@webgenerals.com>
 */

import { Injectable } from "@angular/core";
import { WiaContentService } from "./wia-content.service";
import { WiaSubscriptionService } from "../wia-page/wia-page.subscription.service";
import { WIAInputEntity } from "../wia-page/models/wia-input.entity";
import { TopicBuilder } from "./topic-builder";
import { TopicRowEntity } from "./topic-entities/topic-row.entity";
import { clone } from "../../../lib/util";
import { WiaTopicRow } from "./wia-content-entities/wia-topic-row.entity";
import { Observable } from "rxjs";

@Injectable()
export class TopicService {

  private wiaContentService: WiaContentService;
  private wiaInputData: WIAInputEntity;
  private topicBuilder: TopicBuilder;
  private wiaContentData: Array<WiaTopicRow>;

  constructor(wiaContentService: WiaContentService, wiaPageService: WiaSubscriptionService, topicBuilder: TopicBuilder) {
    this.wiaContentService = wiaContentService;
    this.topicBuilder = topicBuilder;

    wiaPageService.subscribe(value => {
      this.wiaInputData = clone(value);
    });
  }


  /**
   * Retrieves and adapts the topic related data
   *
   * @returns {Array<TopicRowEntity>}
   */

  // @TODO
  getTopics() {

    return this
      .wiaContentService
      .getWiaContent()
      .map(data => {

        this
          .topicBuilder
          .withWiaContent(data);

        this
          .topicBuilder
          .withWiaInputData(this.wiaInputData);

        return this
          .topicBuilder
          .build();
      });
  }
}
