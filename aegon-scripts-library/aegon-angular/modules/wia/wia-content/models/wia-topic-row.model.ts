/**
 * WiaTopicRowModel created on 10/19/16 8:56 AM.
 *
 * @description Holds information about a wia topic row
 * @author Florian Popa <florian@webgenerals.com>
 */
import { WiaTopicModel } from "./wia-topic.model";

export interface WiaTopicRowModel {

  title: string,
  topics: Array<WiaTopicModel>,

}
