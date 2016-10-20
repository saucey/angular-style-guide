import { Component, ElementRef, OnInit } from "@angular/core";
import { AABaseComponent } from "../../../lib/classes/AABaseComponent";
import { WIAInputEntity } from "../wia-page/models/wia-input.entity";
import { WiaPageService } from "../wia-page/wia-page.service";
import { WiaPageProductsService } from "../wia-page/wia-page.products.service";
import { WiaPagePersonalizationService } from "../wia-page/wia-page.personalization.service";

const template = require('./template.html');

@Component({
  selector: 'aa-wia-form',
  providers: [WiaPageService, WiaPageProductsService, WiaPagePersonalizationService],
  template: template
})

/**
 * Collapsible content component
 */
export class WiaFormComponent extends AABaseComponent implements OnInit {

  public products;
  public income = null;
  public modalVisible = false;
  public personalizationCode: string = '';

  public visiblePage: number = 1;

  public options = {
    title: 'Uw persoonlijke situatie instellen'
  };

  constructor(private elementRef: ElementRef,
              private wiaPageProductsService: WiaPageProductsService,
              private wiaPagePersonalizationService: WiaPagePersonalizationService,
              private wiaPageService: WiaPageService) {

    super(elementRef);

    this.products = wiaPageProductsService.getProducts();
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  private getSelectedProducts() {

    return this.products.filter(el => el.selected);
  }

  private serializeInput(): WIAInputEntity {

    const selectedProducts = this.getSelectedProducts();

    return {
      income: this.income,
      products: selectedProducts.map(product => ({
        id: product.id,
        attrs: product.attrs.map(attr => ({
          id: attr.id,
          value: +attr.value
        }))
      })),
      productsIds: selectedProducts.map(el => el.id)
    }
  }

  onProductFormSubmit(event) {

    event.preventDefault();

    const payload = this.serializeInput();

    this.modalVisible = false;

    this.wiaPageService.externalInput$.next(payload);
  }

  onCodeSubmit() {

    const input: WIAInputEntity = this.wiaPagePersonalizationService.codeToInput(this.personalizationCode);

    this.modalVisible = false;

    this.wiaPageService.externalInput$.next(input);
  }

  public trackById(index, el) {
    return el.id;
  }

  public trackByValue(index, el) {
    return el.value;
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

}
