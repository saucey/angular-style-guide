import { Injectable } from "@angular/core";
import { clone } from "../../../lib/util";
import { ProductModel } from "./models/product.model";
const PRODUCTS = require('./datasets/products.json');

const defaultProductsCombinations = require('./datasets/product-combinations.json');

@Injectable()
export class WiaPageProductsService {

  public productConfigurations;

  constructor() {

    this.productConfigurations = this.getProductsConfigurations(defaultProductsCombinations)
  }

  public setProductConfigurations(configurations) {
    this.productConfigurations = configurations;
  }


  private static allStrings(arrays) {
    return !arrays.find(array => array.find(el => typeof el !== 'string'));
  };

  private static flatten(arrays) {
    return arrays.reduce((memo, array) => memo.concat(...array), [])
  }

  private static uniqe(array) {

    return array.reverse().filter((e, i, arr) => arr.lastIndexOf(e) === i).reverse();
  }

  // Utility function expand nested array structure to flat one with all possible combinations
  private productsConfigurationsCompute(iArr) {
    const res = [];

    for (let i = 0; i < iArr.length; i++) {
      let el = iArr[i];

      if (typeof el !== 'string') {
        let extractedArrays = [];

        el.forEach((arr, variationIndex) => {
          let newArr = [...iArr];
          newArr[i] = el[variationIndex];
          extractedArrays.push(newArr);
        });

        res.push(...extractedArrays);
        break;
      }
    }

    if (!res.length) {
      res.push(iArr);
    }

    if (WiaPageProductsService.allStrings(res)) {
      return res;
    } else {
      return this.getProductsConfigurations(res);
    }
  };

  public getProductsConfigurations(arrays) {

    const res = [];

    arrays.forEach(array => {
      res.push(...this.productsConfigurationsCompute(array));
    });

    return res;
  }

  public getAvailableProducts(selectedProducts): string[] {

    const availableCombinations = this.productConfigurations.filter(combination => {
      return selectedProducts.every(selectedProduct => combination.indexOf(selectedProduct) > -1);
    });

    return WiaPageProductsService.uniqe(WiaPageProductsService.flatten(availableCombinations));
  }

  public getProducts() {
    return clone(PRODUCTS);
  }

  /**
   * Sets the default attributes for each product in the list, if missing.
   *
   * @param Array<ProductModel> productsList
   * @returns {Array<ProductModel>}
   */
  public setDefaultAttributes(productsList: Array<ProductModel>) {
    let productsListWithDefaultAttributes: Array<ProductModel> = [],
      defaultProducts = this.getProducts();

    for (let product of productsList) {
      let defaultProduct = defaultProducts.find(el => el.id === product.id);

      for (let defaultAttribute of defaultProduct.attrs) {
        let foundAttr = product.attrs.find(el => el.id === defaultAttribute.id);
        if (!foundAttr) {
           product.attrs.push(defaultAttribute);
        }
      }

      productsListWithDefaultAttributes.push(product);
    }

    return productsListWithDefaultAttributes;
  }
}
