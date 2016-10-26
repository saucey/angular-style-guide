/**
 * WIAInputEntity created on 10/17/16 4:05 PM.
 *
 * @description Holds information regarding the product and income input
 * @author Florian Popa <florian@webgenerals.com>
 */
import { ProductEntity } from "./product.entity";
import { WiaInputUseCaseEnum } from "./wia-input-use-case.enum";

export interface WIAInputEntity {

  useCase: WiaInputUseCaseEnum,
  income: number,
  products: ProductEntity[],
  productsIds?: string[],
  disability?: number,
  usage?: number,
  permDisability?: boolean

}
