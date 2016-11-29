/**
 * AAWiaContentComponent created on 9/29/16 2:20 PM.
 *
 * @description Used to incorporate the collapsible content
 * @author Florian Popa <florian@webgenerals.com>
 */
import { Component, ElementRef, OnInit, ErrorHandler } from "@angular/core";
import { AABaseComponent } from "../../../lib/classes/AABaseComponent";
import { TopicService } from "./topic.service";
import { WiaContentService } from "./wia-content.service";
import { TopicBuilder } from "./topic-builder";
import { WiaSubscriptionService } from "../wia-page/wia-page.subscription.service";
import { TopicDescriptionFilterService } from "./topic-description-filter.service";
import { ProductAttributesService } from "./product-attributes.service";
import { WiaPageProductsService } from "../wia-page/wia-page.products.service";
import { WIAErrorHandlerService } from "./wia-error-handler.service";

@Component({
  selector: 'aa-wia-content',
  providers: [
    TopicService,
    TopicDescriptionFilterService,
    ProductAttributesService,
    WiaPageProductsService,
    TopicBuilder,
    WiaSubscriptionService,
    WiaContentService,
    WIAErrorHandlerService
  ],
  template: `<div class="messages messages--alert visible" *ngIf="showErrorMessage">
  <span class="icon"><span class="pathA"></span><span class="pathB"></span><span class="pathC"></span></span>
  <div class="header">
    Internal error!
  </div>
  <div class="content">
    Please try again later.
  </div>
</div>
<aa-collapsible-topic [topicsCollection]="topicsCollection"></aa-collapsible-topic>`
})

export class WiaContentComponent extends AABaseComponent implements OnInit {

  public topicsCollection;
  private topicService: TopicService;
  public showErrorMessage: boolean = false;

  constructor(private elementRef: ElementRef, topicService: TopicService, private wiaErrorHandlerService: WIAErrorHandlerService) {
    super(elementRef);
    this.topicService = topicService;
  }

  ngOnInit(): void {
    super.ngOnInit();

    this
      .wiaErrorHandlerService
      .subscribe(error => {
        if (null !== error) {
          this.showErrorMessage = true;
        }
      });

    this
      .topicService
      .getTopics(data => {
        this.topicsCollection = data;
      });
  }
}
