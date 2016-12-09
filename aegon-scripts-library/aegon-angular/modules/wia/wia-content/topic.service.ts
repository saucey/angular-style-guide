/**
 * TopicService created on 10/17/16 1:32 PM.
 *
 * @description Retrieve and adapt topic related data to be used in component
 * @author Florian Popa <florian@webgenerals.com>
 */

import { Injectable } from "@angular/core";
import { WiaContentService } from "./wia-content.service";
import { WiaSubscriptionService } from "../wia-page/wia-page.subscription.service";
import { WIAInputModel } from "../wia-page/models/wia-input.model";
import { TopicBuilder } from "./topic-builder";
import { clone } from "../../../lib/util";
import { BehaviorSubject } from "rxjs";
import { WiaPageProductsService } from "../wia-page/wia-page.products.service";

@Injectable()
export class TopicService {

  private wiaContentService: WiaContentService;
  private wiaInputData: WIAInputModel;
  private topicBuilder: TopicBuilder;
  private wiaPageProductsService: WiaPageProductsService;
  public data;
  public topics$: BehaviorSubject<any[]>;

  constructor(wiaContentService: WiaContentService, wiaPageService: WiaSubscriptionService, topicBuilder: TopicBuilder, wiaPageProductsService: WiaPageProductsService) {
    this.wiaContentService = wiaContentService;
    this.topicBuilder = topicBuilder;
    this.wiaPageProductsService = wiaPageProductsService;
    this.topics$ = new BehaviorSubject(null);

    wiaPageService.subscribe(value => {
      this.wiaInputData = clone(value);
      this.wiaInputData.products = this.wiaPageProductsService.setDefaultAttributes(this.wiaInputData.products);
      this.build();
    });

    this
      .wiaContentService
      .getWiaContent()
      .subscribe(data => {
        this.data = data;
        this.build();
      });
  }

  public build(): void {

    if (!this.data) {
      return;
    }

    this
      .topicBuilder
      .withWiaInputData(this.wiaInputData);

    this
      .topicBuilder
      .withWiaContent(this.data);

    this.topics$.next(
      this
        .topicBuilder
        .build()
    )
  }

  /**
   * Retrieves and adapts the topic related data
   *
   * @param callback
   * @returns {Subscription}
   */
  getTopics(callback) {
    return this.topics$.filter(el => el !== null).subscribe(callback);
  }
}
