import { Component, Input, ElementRef, OnInit } from "@angular/core";
import { AABaseComponent } from "../../../lib/classes/AABaseComponent";
import { CalculatorDataService } from "./wia-calculator-data.service";
import { WiaPageProductsService } from "../wia-page/wia-page.products.service";
import { WiaPagePersonalizationService } from "../wia-page/wia-page.personalization.service";
import { defaultOptions } from "./defaultOptions";
import { WIAInputEntity } from "../wia-page/wia-input.entity";
import { WiaPageService } from "../wia-page/wia-page.service";

@Component({
  selector: 'aa-wia-calculator',
  template: require('./template.html'),
  providers: [CalculatorDataService, WiaPageProductsService, WiaPagePersonalizationService]
})
export class WiaCalculator extends AABaseComponent implements OnInit {
  @Input() options: any = {};
  @Input() data: any = {};

  public defaultOptions: any = defaultOptions;

  public submitted: boolean = true;
  public initialAmount: number = 35000;
  public permanentDisability: boolean = false;

  public disability = {
    value: 50,
    help: 'TBD',
    label: 'Arbeidsongeschiktheidspercentage',
    options: {
      start: 50,
      step: 10,
      range: {
        min: 0,
        max: 100
      }
    }
  };

  public usage = {
    value: 50,
    help: 'TBD',
    label: 'Benutting restverdiencapaciteit',
    options: {
      start: 50,
      step: 10,
      range: {
        min: 0,
        max: 100
      }
    }
  };

  public graphData;

  public legendData;

  public productsData;

  constructor(thisElement: ElementRef,
              private wiaPageProductsService: WiaPageProductsService,
              private wiaPagePersonalizationService: WiaPagePersonalizationService,
              private wiaPageService: WiaPageService,
              private calculatorDataService: CalculatorDataService) {

    super(thisElement);


    this.productsData = wiaPageProductsService.getProducts();

    wiaPageService.externalInput$.subscribe(value => this.updateModel(value));

    this.update();
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  public updateModel(value: WIAInputEntity) {

    if (value.income) {
      this.initialAmount = value.income;
    }

    if (typeof value.disability !== 'undefined') {
      this.disability.value = value.disability;
    }

    if (typeof value.usage !== 'undefined') {
      this.usage.value = value.usage;
    }

    if (typeof value.permDisability !== 'undefined') {
      this.permanentDisability = value.permDisability;
    }

    this.productsData.forEach((product: any) => {
      const newProductInput: any = value.products.find(el => el.id === product.id);

      //set selected status
      product.selected = !!newProductInput;

      //set new attributes values
      if (newProductInput) {

        newProductInput.attrs.forEach(attrInput => {
          product.attrs.find(el => el.id === attrInput.id).value = attrInput.value;
        });
      }
    });

    this.update();
  }

  public submit(): void {
    this.submitted = true;
  }

  public getCurrentInput(): WIAInputEntity {

    const products = this.productsData.filter(el => el.selected).map(el => ({
      id: el.id,
      attrs: el.attrs.map(attr => ({id: attr.id, value: +attr.value}))
    }));

    return {
      income: this.initialAmount,
      disability: this.disability.value,
      permDisability: this.permanentDisability,
      usage: this.usage.value,
      products,
      productsIds: products.map(e => e.id)
    };
  }

  public update() {

    const currentInput = this.getCurrentInput();
    const selectedProductsIds = currentInput.products.map(el => el.id);

    this.wiaPagePersonalizationService.setUrlConfiguration(currentInput);

    this.calculatorDataService.getData(currentInput).subscribe(data => {

      // prevent crash in case data couldn't be found
      if (data) {

        const {graphData, legendData} = data;

        this.graphData = graphData;
        this.legendData = legendData;
      }

      const availableProducts = this.wiaPageProductsService.getAvailableProducts(selectedProductsIds);

      this.productsData.forEach((product: any) => {
        product.disabled = availableProducts.indexOf(product.id) === -1;
      });

    })

  }

  public sliderUpdate(slider, val) {

    if (slider.value !== val) {

      slider.value = val;
      this.update();
    }
  }

  public updateProduct(product) {

    product.selected = !product.selected;
    this.update();
  }

  public updateProductAttr(productAttr, event) {

    if (productAttr.value !== event.target.value) {

      productAttr.value = event.target.value;
      this.update();
    }
  }


  public updateIncome(val) {

    if (this.initialAmount !== val) {

      this.initialAmount = val;
      this.update();
    }
  }

  public updatePermDisability(val) {

    this.permanentDisability = !this.permanentDisability;
    this.update();
  }

  public trackById(index, item) {

    return item.id;
  }

}
