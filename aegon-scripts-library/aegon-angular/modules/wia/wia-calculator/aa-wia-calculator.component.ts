import { Component, Input, ElementRef, OnInit } from '@angular/core';

import { AABaseComponent } from "../../../lib/classes/AABaseComponent";
import { CalculatorDataService } from "./aa-wia-calculator-data.service";
import { CalculatorProductsService } from "./aa-wia-calculator-products.service";
import { defaultOptions } from "./defaultOptions";

const products = require('./datasets/products.json');
const components = require('./datasets/components.json');

@Component({
  selector: 'aa-wia-calculator',
  template: require('./template.html'),
  providers: [CalculatorDataService, CalculatorProductsService]
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

  public productsData = products;

  constructor(
    thisElement: ElementRef,
    private calculatorProductsService: CalculatorProductsService,
    private calculatorDataService: CalculatorDataService
  ) {
    super(thisElement);

    this.update();
  }

  ngOnInit() : void {
    super.ngOnInit();
  }

  public submit () : void {
    this.submitted = true;
  }

  public validate(val?: number) : void {

  }

  public getCurrentInput() {

    return {
      income: this.initialAmount,
      disability: this.disability.value,
      permDisability: false, //demo only //this.permanentDisability
      usage: this.usage.value,
      products: this.productsData.filter(el => el.selected).map(el => ({
        id: el.id,
        attrs: el.attrs.map(attr => ({id: attr.id, value: +attr.value}))
      }))
    };
  }

  public update() {

    this.calculatorDataService.getData(this.getCurrentInput())
      .subscribe(
        response => {

          // demo only
          if (!response) {
            return;
          }

          this.graphData = response;
          this.legendData = this.calculatorDataService.getLegendFromGraphData(this.graphData);

          const availableProducts = this.calculatorProductsService.getAvailableProducts(
            this.productsData.filter(el => el.selected).map(el => el.id)
          );

          this.productsData.forEach((product: any) => {
            product.disabled = availableProducts.indexOf(product.id) === -1;
          });
        }
    )

  }

  public sliderUpdate (slider, val) {

    if (slider.value !== val) {

      slider.value = val;
      this.update();
    }
  }

  public updateProduct (product) {

    product.selected = !product.selected;
    this.update();
  }

  public updateProductAttr (productAttr, event) {

    if (productAttr.value !== event.target.value) {

      productAttr.value = event.target.value;
      this.update();
    }
  }


  public updateIncome (val) {

    if (this.initialAmount !== val) {

      this.initialAmount = val;
      this.update();
    }
  }

  public trackById (index, item) {

    return item.id;
  }

}
