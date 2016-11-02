import { WiaTopicDescriptionModel } from "./models/wia-topic-description.model";
import { WiaInputUseCaseEnum } from "./enums/wia-input-use-case.enum";
import { WIAInputModel } from "../wia-page/models/wia-input.model";
import { ProductModel } from "../wia-page/models/product.model";

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
   * @param {WiaTopicDescriptionModel} description
   * @param {WIAInputModel} wiaInput
   * @returns {boolean}
   */
  public isDescriptionFiltered(description: WiaTopicDescriptionModel, wiaInput: WIAInputModel): boolean {
    if (this.matchesUseCase(description, wiaInput) && this.matchesFilters(description, wiaInput)) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Checks if the description filters match the current products selected
   *
   * @param {WiaTopicDescriptionModel} description
   * @param {WIAInputModel} wiaInput
   * @returns {boolean}
   */
  public matchesFilters(description: WiaTopicDescriptionModel, wiaInput: WIAInputModel): boolean {
    if (this.areFiltersValidAndInParticipantOrUserCase(description, wiaInput)) {
      return this.areFiltersMatchingTheProducts(description.filter, wiaInput.products);
    } else {
      return true;
    }
  }

  /**
   * Checks if the filters match any of the AND or OR logical tests
   *
   * @param {Array<string|Array<string>>} filtersList
   * @param {Array<ProductModel>} productsList
   * @returns {boolean}
   */
  public areFiltersMatchingTheProducts(filtersList: Array<string|Array<string>>, productsList: Array<ProductModel>) {
    for (let filters of filtersList) {
      if (this.filterPassesLogicalAnd(filters, productsList) || this.filterPassesLogicalOr(filters, productsList)) {
        return true;
      } else {
        continue;
      }
    }

    return false;
  }

  /**
   * Checks if the filter passes the logical AND test
   *
   * @param {string|Array<string>} filters
   * @param {Array<ProductModel>} productsList
   * @returns {boolean}
   */
  private filterPassesLogicalAnd(filters: string|Array<string>, productsList: Array<ProductModel>) {
    if (Array.isArray(filters)) {
      for (let filter of filters) {
        let found = productsList.find((elem) => {
          if (elem.id === filter) {
            return true;
          } else {
            return false;
          }
        });

        if (typeof found === 'undefined') {
          return false;
        }
      }

      return true;
    } else {
      return false;
    }
  }

  /**
   * Checks if the filter passes the logical OR test
   *
   * @param {string|Array<string>} filter
   * @param {Array<ProductModel>} productsList
   * @returns {boolean}
   */
  private filterPassesLogicalOr(filter: string|Array<string>, productsList: Array<ProductModel>) {
    let found = productsList.find((elem) => {
      if (elem.id === filter) {
        return true;
      } else {
        return false;
      }
    });

    if (typeof found !== 'undefined') {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Checks if the filters and valid and match the PARTICIPANT or USER case
   *
   * @param {WiaTopicDescriptionModel} description
   * @param {WIAInputModel} wiaInput
   * @returns {boolean}
   */
  private areFiltersValidAndInParticipantOrUserCase(description: WiaTopicDescriptionModel, wiaInput: WIAInputModel): boolean {
    if (description.hasOwnProperty('filter') && typeof description.filter == 'object' && description.filter.length > 0 && (wiaInput.useCase === WiaInputUseCaseEnum.PARTICIPANT || wiaInput.useCase === WiaInputUseCaseEnum.USER)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Checks if the description applies to the current use case
   *
   * @param {WiaTopicDescriptionModel} description
   * @param {WIAInputModel} wiaInput
   * @returns {boolean}
   */
  public matchesUseCase(description: WiaTopicDescriptionModel, wiaInput: WIAInputModel): boolean {
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
