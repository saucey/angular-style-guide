/**
 * WiaTopicRow created on 10/19/16 8:56 AM.
 *
 * @description Holds information about a wia topic row
 * @author Florian Popa <florian@webgenerals.com>
 */
import { WiaTopicEntity } from "./wia-topic.entity";

export interface WiaTopicRow {

  title: string,
  topics: WiaTopicEntity[],

}
