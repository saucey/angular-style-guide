import { ProductModel } from "./product.model";
import { WiaInputUseCaseEnum } from "../../wia-content/enums/wia-input-use-case.enum";
/**
 * WIAInputModel created on 10/17/16 4:05 PM.
 *
 * @description Holds information regarding the product and income input
 * @author Florian Popa <florian@webgenerals.com>
 */

export interface WIAInputModel {

  useCase: WiaInputUseCaseEnum,
  income: number,
  products: Array<ProductModel>,
  productsIds?: Array<string>,
  disability?: number,
  usage?: number,
  permDisability?: boolean

}
