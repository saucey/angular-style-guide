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

@Injectable()
export class TopicBuilder {

  private wiaInputData: WIAInputEntity;
  private wiaTopicRowCollection: WiaTopicRow[];

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
      if (false === this.isDescriptionFiltered(description)) {
        let plainDescription = this.findAndReplaceAttributes(description.text, description.filter);
        descriptionList.push(plainDescription);
      }
    });

    return descriptionList;
  }

  private findAndReplaceAttributes(descriptionText: string, filterList): string {
    let inputUseCase = this.wiaInputData.useCase;
    let attributesList = [
      '%COVERAGE_RATE_WGA%',
      '%END_AGE%',
      '%BENEFIT_INDEX%',
      '%WAGE_DEFINITION%',
      '%DEVIATED_MAXIMUM_WAGE%',
      '%INSURED_AMOUNT%',
      '%COVERAGE_RATE_IVA%',
      '%INSURED_AMOUNT%',
      '%BENEFIT_PERIOD%'
    ];

    // if there is a default or user case then remove the attributes
    if (WiaInputUseCaseEnum.DEFAULT === inputUseCase || WiaInputUseCaseEnum.USER === inputUseCase) {

      if (false === filterList) {
        return descriptionText;
      } else {
        let plainDescription = descriptionText;
        for (let placeholder of attributesList) {
          if (plainDescription.indexOf(placeholder) != -1) {
            plainDescription = plainDescription.replace(placeholder, '');
          }
        }

        return plainDescription;
      }

    } else {
      // if the case is participant then replace them
      if (filterList === true || false === filterList) {
        return descriptionText;
      } else {
        let plainDescription = descriptionText;
        for (let filter of filterList) {
          for (let product of this.wiaInputData.products) {
            if (product.id == filter) {
              for (let attribute of product.attrs) {
                let placeholder = '%' + attribute.id + '%';
                if (plainDescription.indexOf(placeholder) != -1) {
                  plainDescription = plainDescription.replace(placeholder, (attribute.value as string));
                }
              }
            }
          }
        }

        return plainDescription;
      }
    }
  }

  /**
   * Checks if the description should be shown/hidden
   *
   * @param {WiaTopicDescriptionEntity} descriptionFilter
   * @returns {boolean}
   */
  private isDescriptionFiltered(descriptionFilter: WiaTopicDescriptionEntity): boolean {
    if (this.matchesUseCase(descriptionFilter) && this.matchesFilters(descriptionFilter)) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Checks if the description filters match the current products selected
   *
   * @param {WiaTopicDescriptionEntity} descriptionFilter
   * @returns {boolean}
   */
  public matchesFilters(descriptionFilter: WiaTopicDescriptionEntity): boolean {
    if (descriptionFilter.hasOwnProperty('filter') && typeof descriptionFilter.filter == 'object' && descriptionFilter.filter.length > 0 && (this.wiaInputData.useCase === WiaInputUseCaseEnum.PARTICIPANT || this.wiaInputData.useCase === WiaInputUseCaseEnum.USER)) {
      for (let productId of descriptionFilter.filter) {
        for (let product of this.wiaInputData.products) {
          if (product.id == productId) {  // @TODO enforce string comparison by strong typing
            return true;
          }
        }
      }
      return false;
    } else {
      return true;
    }
  }

  /**
   * Checks if the description applies to the current use case
   *
   * @param {WiaTopicDescriptionEntity} descriptionFilter
   * @returns {boolean}
   */
  private matchesUseCase(descriptionFilter: WiaTopicDescriptionEntity): boolean {
    if (descriptionFilter.hasOwnProperty('useCase') && descriptionFilter.useCase.length > 0) {
      let inputUseCase = this.wiaInputData.useCase;

      for (let useCase of descriptionFilter.useCase) {
        if (inputUseCase === WiaInputUseCaseEnum[useCase]) {
          return true;
        }
      }

      return false;
    } else {
      return true;
    }
  }

}
