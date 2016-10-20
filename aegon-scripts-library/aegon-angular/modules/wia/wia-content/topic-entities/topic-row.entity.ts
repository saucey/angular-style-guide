import { TopicEntity } from "./topic.entity";
/**
 * topic-row.entity created on 10/18/16 9:34 AM.
 *
 * @description Holds information regarding a topic row
 * @author Florian Popa <florian@webgenerals.com>
 */

export interface TopicRowEntity {

  title: string;
  topics: TopicEntity[];

}
