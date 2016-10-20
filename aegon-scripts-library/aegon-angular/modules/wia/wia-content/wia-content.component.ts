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
import { WiaPageService } from "../wia-page/wia-page.service";

@Component({
  selector: 'aa-wia-content',
  providers: [
    TopicService,
    TopicBuilder,
    WiaContentService
  ],
  template: `<aa-collapsible-topic [topicsCollection]="topicsCollection"></aa-collapsible-topic>`
})

export class WiaContentComponent extends AABaseComponent implements OnInit {

  public topicsCollection;
  private topicService: TopicService;

  constructor(private elementRef: ElementRef, topicService: TopicService, wiaPageService: WiaPageService) {
    super(elementRef);
    this.topicService = topicService;

    // @TODO need to see if we can move this subscription at the service level only
    wiaPageService.externalInput$.subscribe(value => {
      this.topicsCollection = this
        .topicService
        .getTopics();
    });
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.topicsCollection = this
      .topicService
      .getTopics();
  }
}
