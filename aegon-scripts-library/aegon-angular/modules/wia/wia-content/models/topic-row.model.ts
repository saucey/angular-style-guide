import { TopicModel } from "./topic.model";
/**
 * TopicRowModel created on 10/18/16 9:34 AM.
 *
 * @description Holds information regarding a topic row
 * @author Florian Popa <florian@webgenerals.com>
 */

export interface TopicRowModel {

  title: string;
  topics: Array<TopicModel>;

}
