/**
 * TopicBuilder created on 10/18/16 9:05 AM.
 *
 * @description Builder for topics
 * @author Florian Popa <florian@webgenerals.com>
 */
import { Injectable } from "@angular/core";
import { WIAInputModel } from "../wia-page/models/wia-input.model";
import { WiaTopicRowModel } from "./models/wia-topic-row.model";
import { WiaTopicModel } from "./models/wia-topic.model";
import { WiaTopicDescriptionModel } from "./models/wia-topic-description.model";
import { TopicRowModel } from "./models/topic-row.model";
import { WiaInputUseCaseEnum } from "./enums/wia-input-use-case.enum";
import { TopicDescriptionFilterService } from "./topic-description-filter.service";
import { ProductAttributesService } from "./product-attributes.service";

@Injectable()
export class TopicBuilder {

  private wiaInputData: WIAInputModel;
  private wiaTopicRowCollection: WiaTopicRowModel[];
  private topicDescriptionFilterService: TopicDescriptionFilterService;
  private productAttributesService: ProductAttributesService;

  constructor(topicDescriptionFilterService: TopicDescriptionFilterService, productAttributesService: ProductAttributesService) {
    this.topicDescriptionFilterService = topicDescriptionFilterService;
    this.productAttributesService = productAttributesService;
  }

  /**
   * @param {WIAInputModel} wiaInputData
   */
  public withWiaInputData(wiaInputData: WIAInputModel): void {
    this.wiaInputData = wiaInputData;

    if ('undefined' === typeof this.wiaInputData) {
      this.wiaInputData = {
        useCase: WiaInputUseCaseEnum.DEFAULT,
        income: null,
        products: []
      };
    }
  }

  /**
   * @param {Array<WiaTopicRowModel>} wiaContent
   */
  public withWiaContent(wiaContent: Array<WiaTopicRowModel>): void {
    this.wiaTopicRowCollection = wiaContent;
  }

  public build(): Array<TopicRowModel> {

    let topicRowCollection: Array<TopicRowModel> = [];

    this.wiaTopicRowCollection.forEach((topicRow: WiaTopicRowModel, rowIndex: number) => {

      topicRowCollection[rowIndex] = {
        "title": topicRow.title,
        "topics": []
      };

      topicRow.topics.forEach((topic: WiaTopicModel, colIndex) => {
        topicRowCollection[rowIndex].topics[colIndex] = {
          "image": topic.image,
          "shortDescription": [],
          "longDescription": []
        };

        topicRowCollection[rowIndex].topics[colIndex].shortDescription = this.filterDescription(topic.shortDescription);
        topicRowCollection[rowIndex].topics[colIndex].longDescription = this.filterDescription(topic.longDescription);
      });
    });

    return topicRowCollection;
  }

  /**
   * Filter the wia descriptions
   *
   * @param {Array<WiaTopicDescriptionModel>} list
   * @returns {Array<string>}
   */
  private filterDescription(list: Array<WiaTopicDescriptionModel>): Array<string> {
    let descriptionList: Array<string> = [];

    list.forEach((description: WiaTopicDescriptionModel, index) => {
      if (false === this.topicDescriptionFilterService.isDescriptionFiltered(description, this.wiaInputData)) {
        let plainDescription = this
          .productAttributesService
          .findAndReplaceAttributes(
            description,
            this.wiaInputData
          );
        descriptionList.push(plainDescription);
      }
    });

    return descriptionList;
  }
}
