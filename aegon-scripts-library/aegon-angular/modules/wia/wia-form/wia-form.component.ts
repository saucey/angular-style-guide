import {
  Component,
  ElementRef,
  OnInit,
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/core";

import { AABaseComponent } from "../../../lib/classes/AABaseComponent";
import { WIAInputModel } from "../wia-page/models/wia-input.model";
import { WiaSubscriptionService } from "../wia-page/wia-page.subscription.service";
import { WiaPageProductsService } from "../wia-page/wia-page.products.service";
import { WiaPagePersonalizationService } from "../wia-page/wia-page.personalization.service";
import { ProductAttributeModel } from "../wia-page/models/product-attribute.model";
import { WiaInputUseCaseEnum } from "../wia-content/enums/wia-input-use-case.enum";

const FORM_TEMPLATE = require('./template.html');

@Component({
  selector: 'aa-wia-form',
  providers: [WiaSubscriptionService, WiaPageProductsService, WiaPagePersonalizationService],
  template: FORM_TEMPLATE,
  animations: [
    trigger('flyTop', [
      state('in', style({
        transform: 'translateY(0)',
        opacity: 1
      })),
      transition('void => *', [
        style({
          transform: 'translateY(-5%)',
          opacity: 0
        }),
        animate(300)
      ])
    ])
  ]
})

/**
 * Collapsible content component
 */
export class WiaFormComponent extends AABaseComponent implements OnInit {

  public products;
  public income;
  public submitted = false;
  public personalizationCode: string = '';

  public visiblePage: number = 1;

  public step: number = 1;

  public options = {
    title: 'Uw persoonlijke situatie instellen'
  };

  constructor(private elementRef: ElementRef,
              private wiaPageProductsService: WiaPageProductsService,
              private wiaPagePersonalizationService: WiaPagePersonalizationService,
              private wiaSubscriptionService: WiaSubscriptionService) {

    super(elementRef);

    this.products = wiaPageProductsService.getProducts();


    // Form filled or personalization code sent => form submitted
    this.wiaSubscriptionService.subscribe(() => {
      this.submitted = true;
    });
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  private getSelectedProducts() {

    return this.products.filter(el => el.selected);
  }

  private serializeInput(): WIAInputModel {

    const SELECTED_PRODUCTS = this.getSelectedProducts();

    return {
      useCase: WiaInputUseCaseEnum.USER,
      income: this.income,
      products: SELECTED_PRODUCTS.map(product => ({
        id: product.id,
        attrs: product.attrs.map(attr => ({
          id: attr.id,
          value: +attr.value
        }))
      })),
      productsIds: SELECTED_PRODUCTS.map(el => el.id)
    }
  }

  onProductFormSubmit(event) {

    event.preventDefault();

    const payload = this.serializeInput();

    this.wiaSubscriptionService.emit(payload);
  }

  onCodeSubmit() {

    const input: WIAInputModel = this.wiaPagePersonalizationService.codeToInput(this.personalizationCode);

    this.wiaSubscriptionService.emit(input);
  }

  public trackById(index, el) {
    return el.id;
  }

  public trackByValue(index, el) {
    return el.value;
  }

  public getProducts () {
    return this.products.filter(el => !el.hidden);
  }

  public updateProduct(product) {

    product.selected = !product.selected;

    const availableProducts = this.wiaPageProductsService.getAvailableProducts(
      this.getSelectedProducts().map(el => el.id)
    );

    this.products.forEach((el: any) => {
      el.disabled = availableProducts.indexOf(el.id) === -1;
    });
  }

  /**
   * Checks if the product attribute is visible
   *
   * @param {ProductAttributeModel} productAttribute
   * @returns {boolean}
   */
  public isProductAttributeVisible(productAttribute: ProductAttributeModel) {
    if (productAttribute.hasOwnProperty('visible') && true === productAttribute.visible) {
      return true;
    } else {
      return false;
    }
  }

}
