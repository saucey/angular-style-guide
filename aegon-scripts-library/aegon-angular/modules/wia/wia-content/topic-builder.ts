/**
 * TopicBuilder created on 10/18/16 9:05 AM.
 *
 * @description Builder for topics
 * @author Florian Popa <florian@webgenerals.com>
 */
import { Injectable } from "@angular/core";
import { WIAInputEntity } from "../wia-page/wia-input.entity";
import { WiaTopicRow } from "./wia-content-entities/wia-topic-row.entity";
import { WiaTopicEntity } from "./wia-content-entities/wia-topic.entity";
import { WiaTopicDescriptionEntity } from "./wia-content-entities/wia-topic-description.entity";
import { TopicRowEntity } from "./topic-entities/topic-row.entity";

@Injectable()
export class TopicBuilder {

  private productIncomeData: WIAInputEntity;
  private wiaTopicRowCollection: WiaTopicRow[];

  withProductIncomeData(productIncomeData: WIAInputEntity): void {
    this.productIncomeData = productIncomeData;
  }

  withWiaContent(wiaContent): void {
    this.wiaTopicRowCollection = wiaContent;
  }

  build(): Array<TopicRowEntity> {

    let topicRowCollection: Array<TopicRowEntity> = [];

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

        let shortDescriptions = topic.shortDescription;
        let longDescriptions = topic.longDescription;

        shortDescriptions.forEach((description: WiaTopicDescriptionEntity, index) => {
          if (false === this.isDescriptionFiltered(description.filter)) {
            topicRowCollection[rowIndex].topics[colIndex].shortDescription.push(description.text);
          }
        });

        longDescriptions.forEach((description, index) => {
          if (false === this.isDescriptionFiltered(description.filter)) {
            topicRowCollection[rowIndex].topics[colIndex].longDescription.push(description.text);
          }
        });
      });
    });

    return topicRowCollection;
  }

  private isDescriptionFiltered(descriptionFilter): boolean {
    if (descriptionFilter === true) {
      return true;
    } else if (descriptionFilter === false) {
      return false;
    } else if (typeof descriptionFilter === 'object') {
      for (let productId of descriptionFilter) {
        for (let product of this.productIncomeData.products) {
          if (product.id == productId) {
            return false;
          }
        }
      }

      return true;
    }
  }

}
