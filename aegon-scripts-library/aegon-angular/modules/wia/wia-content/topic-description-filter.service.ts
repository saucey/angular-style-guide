import { WiaTopicDescriptionEntity } from "./wia-content-entities/wia-topic-description.entity";
import { WiaInputUseCaseEnum } from "../wia-page/models/wia-input-use-case.enum";
import { WIAInputEntity } from "../wia-page/models/wia-input.entity";

/**
 * TopicDescriptionFilterService created on 10/27/16 2:49 PM.
 *
 * @description Filter for topic description data
 * @author Florian Popa <florian@webgenerals.com>
 */
export class TopicDescriptionFilterService {

  /**
   * Checks if the description should be shown/hidden
   *
   * @param {WiaTopicDescriptionEntity} description
   * @param {WIAInputEntity} wiaInput
   * @returns {boolean}
   */
  public isDescriptionFiltered(description: WiaTopicDescriptionEntity, wiaInput: WIAInputEntity): boolean {
    if (this.matchesUseCase(description, wiaInput) && this.matchesFilters(description, wiaInput)) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Checks if the description filters match the current products selected
   *
   * @param {WiaTopicDescriptionEntity} description
   * @param {WIAInputEntity} wiaInput
   * @returns {boolean}
   */
  public matchesFilters(description: WiaTopicDescriptionEntity, wiaInput: WIAInputEntity): boolean {
    if (description.hasOwnProperty('filter') && typeof description.filter == 'object' && description.filter.length > 0 && (wiaInput.useCase === WiaInputUseCaseEnum.PARTICIPANT || wiaInput.useCase === WiaInputUseCaseEnum.USER)) {
      for (let productId of description.filter) {
        for (let product of wiaInput.products) {
          /**
           * @TODO enforce string comparison by strong typing
           */
          if (product.id == productId) {
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
   * @param {WiaTopicDescriptionEntity} description
   * @param {WIAInputEntity} wiaInput
   * @returns {boolean}
   */
  public matchesUseCase(description: WiaTopicDescriptionEntity, wiaInput: WIAInputEntity): boolean {
    if (description.hasOwnProperty('useCase') && description.useCase.length > 0) {
      let inputUseCase = wiaInput.useCase;

      for (let useCase of description.useCase) {
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
