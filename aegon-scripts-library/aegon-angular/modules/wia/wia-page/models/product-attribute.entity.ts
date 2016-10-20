import { AttributeOptionEntity } from "./product-attribute-option.entity";
/**
 * ProductAttributeEntity created on 10/21/16 1:31 PM.
 *
 * @description Holds information regarding a product attribute
 * @author Florian Popa <florian@webgenerals.com>
 */

export interface ProductAttributeEntity {

  id: string;
  label?: string;
  value: number|string;
  visible?: boolean;
  options?: Array<AttributeOptionEntity>;

}
