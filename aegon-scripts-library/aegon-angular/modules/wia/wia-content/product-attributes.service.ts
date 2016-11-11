import { WIAInputModel } from "../wia-page/models/wia-input.model";
import { WiaInputUseCaseEnum } from "./enums/wia-input-use-case.enum";
import { WiaTopicDescriptionModel } from "./models/wia-topic-description.model";
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
   * @param {WiaTopicDescriptionModel} topicDescription
   * @param {WIAInputModel} wiaInput
   * @returns {string}
   */
  public findAndReplaceAttributes(topicDescription: WiaTopicDescriptionModel, wiaInput: WIAInputModel): string {
    let inputUseCase = wiaInput.useCase,
      descriptionText = this.replaceGenericPlaceholders(topicDescription, wiaInput),
      filters = topicDescription.filter;

    if (WiaInputUseCaseEnum.DEFAULT === inputUseCase || WiaInputUseCaseEnum.USER === inputUseCase) {
      return this.removePlaceholdersForDefaultAndUser(descriptionText, filters);
    } else {
      return this.replaceAttributeValuesForParticipants(descriptionText, filters, wiaInput);
    }
  }

  private replaceGenericPlaceholders(topicDescription: WiaTopicDescriptionModel, wiaInput: WIAInputModel) {
    let description = topicDescription.text;
    if (topicDescription.hasOwnProperty('placeholder')) {
      let placeholder = topicDescription.placeholder;
      switch (placeholder) {
        case 'UPGRADE_QUERY':
          description = this.searchAndReplaceUpgradeQueries(topicDescription.text, wiaInput.products);
          break;
        case 'IVA_WGA_AANV_QUERY':  // @TODO topicDescription.text not needed here
          description = this.handleIvaWgaAanvQuery(topicDescription.text, wiaInput.products);
          break;
        case 'COVERAGE_RATE_QUERY':
          description = this.searchAndReplaceCoverageQueries(topicDescription.text, wiaInput.products, wiaInput.useCase);
          break;
      }
    }

    return description;
  }

  private searchAndReplaceCoverageQueries(descriptionText, products, useCase) {

    let description = descriptionText;

    if (description.indexOf('%COV_RATE_IVA_PLACEHOLDER%') != -1) {
      const found = !!products.find(el => el.id === 'IVA_EXCED');

      if (found && useCase === WiaInputUseCaseEnum.PARTICIPANT) {
        description = description.replace('%COV_RATE_IVA_PLACEHOLDER%', '<code> %COVERAGE_RATE_IVA%%</code>');
      } else {
        description = description.replace('%COV_RATE_IVA_PLACEHOLDER%', '');
      }
    }

    if (description.indexOf('%COV_RATE_WGA_PLACEHOLDER%') != -1) {
      const found = !!products.find(el => el.id === 'WGA_EXCED');

      if (found && useCase === WiaInputUseCaseEnum.PARTICIPANT) {
        description = description.replace('%COV_RATE_WGA_PLACEHOLDER%', '<code> %COVERAGE_RATE_WGA%%</code>');
      } else {
        description = description.replace('%COV_RATE_WGA_PLACEHOLDER%', '');
      }
    }

    return description;
  }

  private handleIvaWgaAanvQuery(descriptionText, products) {
    let hasIva = false,
      hasWga = false,
      hasAanv = false,
      description = '<p>';

    for (let product of products) {
      if (product.id === 'WGA_EXCED') {
        hasWga = true;
      } else if (product.id === 'IVA_EXCED') {
        hasIva = true;
      } else if (product.id === 'WGA_AANV_UPGRADE' || product.id === 'WGA_AANV_LIGHT' || product.id === 'WGA_AANV_STANDARD') {
        hasAanv = true;
      }
    }

    if (hasIva) {
      if (hasWga) {
        if (hasAanv) {
          description += "IVA-Excedentverzekering <code>%COVERAGE_RATE_IVA%%</code>, WGA-Excedentverzekering <code>%COVERAGE_RATE_WGA%%</code> en WGA-Aanvullingsverzekering (light/upgrade).";
        } else {
          description += "IVA-Excedentverzekering <code>%COVERAGE_RATE_IVA%%</code> en WGA-Excedentverzekering <code>%COVERAGE_RATE_WGA%%</code>.";
        }
      } else {
        if (hasAanv) {
          description += "IVA-Excedentverzekering <code>%COVERAGE_RATE_IVA%%</code> en WGA-Aanvullingsverzekering (light/upgrade).";
        } else {
          description += "IVA-Excedentverzekering <code>%COVERAGE_RATE_IVA%%</code>.";
        }
      }
    } else {
      if (hasWga) {
        if (hasAanv) {
          description += "WGA-Excedentverzekering <code>%COVERAGE_RATE_WGA%%</code> en WGA-Aanvullingsverzekering (light/upgrade).";
        } else {
          description += "WGA-Excedentverzekering <code>%COVERAGE_RATE_WGA%%</code>.";
        }
      } else {
        if (hasAanv) {
          description += 'WGA-Aanvullingsverzekering (light/upgrade).';
        } else {
          description += '';
        }
      }
    }

    description += '</p>';
    return description;
  }

  private searchAndReplaceUpgradeQueries(descriptionText, products) {
    let description = descriptionText,
      hasUpgrade = false;

    for (let product of products) {
      if (product.id === 'WGA_AANV_UPGRADE') {
        hasUpgrade = true;
        break;
      }
    }

    if (hasUpgrade) {
      while (description.indexOf('%UPGRADE_PLACEHOLDER%') != -1) {
        description = description.replace('%UPGRADE_PLACEHOLDER%', ' upgrade');
      }
    } else {
      while (description.indexOf('%UPGRADE_PLACEHOLDER%') != -1) {
        description = description.replace('%UPGRADE_PLACEHOLDER%', '');
      }
    }

    return description;
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
