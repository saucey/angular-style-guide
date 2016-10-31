import { WIAInputModel } from "../wia-page/models/wia-input.model";
import { WiaInputUseCaseEnum } from "./enums/wia-input-use-case.enum";
/**
 * ProductAttributesService created on 10/28/16 8:28 AM.
 *
 * @description Manipulates product attributes inside wia content descriptions
 * @author Florian Popa <florian@webgenerals.com>
 */

const ATTRIBUTES_LIST = [
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

export class ProductAttributesService {

  /**
   * Finds and replaces the attributes of descriptions
   *
   * @param {string} descriptionText
   * @param {Array} filterList
   * @param {WIAInputModel} wiaInput
   * @returns {string}
   */
  public findAndReplaceAttributes(descriptionText: string, filterList, wiaInput: WIAInputModel): string {
    let inputUseCase = wiaInput.useCase;
    if (WiaInputUseCaseEnum.DEFAULT === inputUseCase || WiaInputUseCaseEnum.USER === inputUseCase) {
      return this.removePlaceholdersForDefaultAndUser(descriptionText, filterList);
    } else {
      return this.replaceAttributeValuesForParticipants(descriptionText, filterList, wiaInput);
    }
  }

  /**
   * Removes the placeholders for the default and user cases.
   *
   * @param {string} descriptionText
   * @param {Array} filterList
   * @returns {string}
   */
  private removePlaceholdersForDefaultAndUser(descriptionText: string, filterList): string {
    let plainDescription = descriptionText;
    for (let placeholder of ATTRIBUTES_LIST) {
      if (plainDescription.indexOf(placeholder) != -1) {
        plainDescription = plainDescription.replace(placeholder, '');
      }
    }

    return plainDescription;
  }

  /**
   * Replaces attribute values inside descriptions for participant cases.
   *
   * @param {string} descriptionText
   * @param {Array} filterList
   * @param {WIAInputModel} wiaInput
   * @returns {string}
   */
  private replaceAttributeValuesForParticipants(descriptionText: string, filterList, wiaInput: WIAInputModel): string {
    let plainDescription = descriptionText;
    for (let filter of filterList) {
      for (let product of wiaInput.products) {
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
