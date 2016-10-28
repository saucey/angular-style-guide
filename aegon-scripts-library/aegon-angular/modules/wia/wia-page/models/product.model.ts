import { ProductAttributeModel } from "./product-attribute.model";
/**
 * ProductModel created on 10/17/16 4:12 PM.
 *
 * @description Holds information regarding the product
 * @author Florian Popa <florian@webgenerals.com>
 */
export interface ProductModel {
  id: string,
  endAge?: number,
  benefitIndex?: number,
  attrs: Array<ProductAttributeModel>,
  label?: string
}
