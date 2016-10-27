/**
 * TopicBuilder created on 10/18/16 9:05 AM.
 *
 * @description Builder for topics
 * @author Florian Popa <florian@webgenerals.com>
 */
import { Injectable } from "@angular/core";
import { WIAInputEntity } from "../wia-page/models/wia-input.entity";
import { WiaTopicRow } from "./wia-content-entities/wia-topic-row.entity";
import { WiaTopicEntity } from "./wia-content-entities/wia-topic.entity";
import { WiaTopicDescriptionEntity } from "./wia-content-entities/wia-topic-description.entity";
import { TopicRowEntity } from "./topic-entities/topic-row.entity";
import { WiaInputUseCaseEnum } from "../wia-page/models/wia-input-use-case.enum";
import { TopicDescriptionFilterService } from "./topic-description-filter.service";
import { ProductAttributesService } from "./product-attributes.service";

@Injectable()
export class TopicBuilder {

  private wiaInputData: WIAInputEntity;
  private wiaTopicRowCollection: WiaTopicRow[];
  private topicDescriptionFilterService: TopicDescriptionFilterService;
  private productAttributesService: ProductAttributesService;

  constructor(topicDescriptionFilterService: TopicDescriptionFilterService, productAttributesService: ProductAttributesService) {
    this.topicDescriptionFilterService = topicDescriptionFilterService;
    this.productAttributesService = productAttributesService;
  }

  /**
   * @param {WIAInputEntity} wiaInputData
   */
  public withWiaInputData(wiaInputData: WIAInputEntity): void {
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
   * @param {Array<WiaTopicRow>} wiaContent
   */
  public withWiaContent(wiaContent: Array<WiaTopicRow>): void {
    this.wiaTopicRowCollection = wiaContent;
  }

  public build(): Array<TopicRowEntity> {

    let topicRowCollection: Array<TopicRowEntity> = [];

    console.log('input at build time: ', this.wiaInputData);

    this.wiaTopicRowCollection.forEach((topicRow: WiaTopicRow, rowIndex: number) => {

      topicRowCollection[rowIndex] = {
        "title": topicRow.title,
        "topics": []
      };

      topicRow.topics.forEach((topic: WiaTopicEntity, colIndex) => {
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
   * @param {Array<WiaTopicDescriptionEntity>} list
   * @returns {Array<string>}
   */
  private filterDescription(list: Array<WiaTopicDescriptionEntity>): Array<string> {
    let descriptionList: Array<string> = [];

    list.forEach((description: WiaTopicDescriptionEntity, index) => {
      if (false === this.topicDescriptionFilterService.isDescriptionFiltered(description, this.wiaInputData)) {
        let plainDescription = this
          .productAttributesService
          .findAndReplaceAttributes(
            description.text,
            description.filter,
            this.wiaInputData
          );
        descriptionList.push(plainDescription);
      }
    });

    return descriptionList;
  }
}
