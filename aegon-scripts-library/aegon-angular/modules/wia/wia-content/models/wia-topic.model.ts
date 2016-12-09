/**
 * WiaTopicModel created on 10/19/16 8:57 AM.
 *
 * @description Holds information about a wia topic
 * @author Florian Popa <florian@webgenerals.com>
 */
import { WiaTopicDescriptionModel } from "./wia-topic-description.model";

export interface WiaTopicModel {

  image: string,
  imageName: string,
  shortDescription: Array<WiaTopicDescriptionModel>,
  longDescription: Array<WiaTopicDescriptionModel>,

}
