/**
 * ProductEntity created on 10/17/16 4:12 PM.
 *
 * @description Holds information regarding the product
 * @author Florian Popa <florian@webgenerals.com>
 */
export interface ProductEntity {
  id: string,
  endAge?: number,
  benefitIndex?: number,
  attrs: any[],
  label?: string
}
