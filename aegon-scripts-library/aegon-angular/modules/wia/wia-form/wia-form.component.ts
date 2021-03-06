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
import { CalculatorDataService } from "../wia-calculator/wia-calculator-data.service";
import { WIATealiumService } from "../wia-page/wia-tealium.service";

const FORM_TEMPLATE = require('./template.html');

declare const jQuery;

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

  public visiblePage: number = 2;

  public step: number = 1;

  public incomeValid: boolean = true;
  public codeValid: boolean = true;

  //is form submitted and there is a pending request
  public pending: boolean = false;

  public options = {
    title: 'Uw persoonlijke situatie instellen'
  };

  constructor(private elementRef: ElementRef,
              private wiaPageProductsService: WiaPageProductsService,
              private calculatorDataService: CalculatorDataService,
              private wiaPagePersonalizationService: WiaPagePersonalizationService,
              private wiaSubscriptionService: WiaSubscriptionService,
              private wiaTealiumService: WIATealiumService) {

    super(elementRef);

    this.products = wiaPageProductsService.getProducts();


    // Form filled or personalization code sent => form submitted
    this.wiaSubscriptionService.externalInput$.subscribe((value) => {
      this.submitted = !!value; //if value is null - show form
      if (this.submitted) {
        this.incomeValid = true;
        this.codeValid = true;
      }

      if (this.wiaSubscriptionService.navigationMessage) {
        this.scrollToForm();
      }

    }, () => {
      this.submitted = true; //if error occurred -  hide form
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

  private validateIncome () {
    this.incomeValid = this.isIncomeValid(+this.income);
  }

  private isIncomeValid(income: number) {
    return income >= 2500 && income <= 500000;
  }

  onProductFormSubmit(event) {
    event.preventDefault();

    this.validateIncome();

    if (this.incomeValid === false) {
      return;
    }

    this.pending = true;
    const payload = this.serializeInput();

    this.calculatorDataService.getData(payload).subscribe(() => {
      this.pending = false;
      this.wiaSubscriptionService.emit(payload, true);
    }, err => {
      this.submitted = true;
      this.wiaSubscriptionService.externalInput$.error({
        type: 'response',
        details: err
      })
    });
  }

  onCodeSubmit() {

    this.validateIncome();
    this.codeValid = this.wiaPagePersonalizationService.isCodeValid(this.personalizationCode);

    if (!this.incomeValid || !this.codeValid) {
      return;
    }

    this
      .wiaTealiumService
      .wiaFirstInteractionWithTool();

    this.pending = true;
    const input: WIAInputModel = this.wiaPagePersonalizationService.codeToInput(this.personalizationCode);

    this.calculatorDataService.getData(input).subscribe(() => {
      this.pending = false;
      this.wiaSubscriptionService.emit(input, true);
    });
  }

  public trackById(index, el) {
    return el.id;
  }

  public trackByValue(index, el) {
    return el.value;
  }

  public getProducts (column) {
    return this.products.filter(el => !el.hidden && (column ? el.column === column : true));
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

  public setActivePage (formId: number) {
    this.visiblePage = formId;

    if (this.visiblePage === 1) {
      this.products = this.wiaPageProductsService.getProducts();
    }
  }

  private scrollToForm () {
    const PADDING = 20;
    const position = jQuery(this.elementRef.nativeElement).offset().top - PADDING;

    jQuery('html,body').animate({
      scrollTop: position
    })
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
