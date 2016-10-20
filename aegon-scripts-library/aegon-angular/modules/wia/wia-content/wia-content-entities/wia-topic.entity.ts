/**
 * WiaTopicEntity created on 10/19/16 8:57 AM.
 *
 * @description Holds information about a wia topic
 * @author Florian Popa <florian@webgenerals.com>
 */
import { WiaTopicDescriptionEntity } from "./wia-topic-description.entity";

export interface WiaTopicEntity {

  image: string,
  shortDescription: WiaTopicDescriptionEntity[],
  longDescription: WiaTopicDescriptionEntity[],

}
