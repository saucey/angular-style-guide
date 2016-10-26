/**
 * AAWiaContentComponent created on 9/29/16 2:20 PM.
 *
 * @description Used to incorporate the collapsible content
 * @author Florian Popa <florian@webgenerals.com>
 */
import { Component, ElementRef, OnInit } from "@angular/core";
import { AABaseComponent } from "../../../lib/classes/AABaseComponent";
import { TopicService } from "./topic.service";
import { WiaContentService } from "./wia-content.service";
import { TopicBuilder } from "./topic-builder";
import { WiaSubscriptionService } from "../wia-page/wia-page.subscription.service";

@Component({
  selector: 'aa-wia-content',
  providers: [
    TopicService,
    TopicBuilder,
    WiaSubscriptionService,
    WiaContentService
  ],
  template: `<aa-collapsible-topic [topicsCollection]="topicsCollection"></aa-collapsible-topic>`
})

export class WiaContentComponent extends AABaseComponent implements OnInit {

  public topicsCollection;
  private topicService: TopicService;

  constructor(private elementRef: ElementRef, topicService: TopicService) {
    super(elementRef);
    this.topicService = topicService;
  }

  ngOnInit(): void {
    super.ngOnInit();

    this
      .topicService
      .getTopics()
      .subscribe(data => {
        this.topicsCollection = data;
      });
  }
}
