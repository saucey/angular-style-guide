/**
 * WiaTopicDescriptionModel created on 10/19/16 8:57 AM.
 *
 * @description Holds information about wia topic description
 * @author Florian Popa <florian@webgenerals.com>
 */

export interface WiaTopicDescriptionModel {

  useCase?: Array<string>,
  filter: Array<string|Array<string>>,
  text: string,

}
