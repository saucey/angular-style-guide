import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { WIAInputEntity } from "../wia-page/models/wia-input.entity";

const productsMetadata = require('./datasets/components.json');
const componentGroups = require('./datasets/componentsGroups.json');
const mocks = require('./datasets/demo.json');

@Injectable()
export class CalculatorDataService {

  constructor(private http: Http) {
  }

  private static extractComponentsFromProducts(products) {

    return products.map(el => el.components)
      .reduce(function (a, b) {
        return a.concat(b);
      });
  }

  private static getColumnWidth(data, index: number) {

    return {
      0: 15,
      1: 15,
      2: data.periods.length === 3 ? 70 : 30,
      3: 40
    }[index];

  }

  // Sort by priority, for the same priority numbers use reverse order
  private static sortByPriority(items) {

    return items.reverse().sort((a, b) => a.priority < b.priority);
  }

  attachMetadata(items) {

    items.forEach((item: any) => {

      item.meta = productsMetadata.find(el => el.id === item.id);
    });

    return items;
  }

  parseRawData(data) {

    // demo only
    if (!data) {
      return;
    }

    const res: any = {};

    data.periods.forEach((val, index) => {

      if (val) {

        res[index] = {
          id: index,
          amount: val.amount,
          label: val.label,
          percentage: val.percentage,
          bars: CalculatorDataService.sortByPriority(
            this.attachMetadata(CalculatorDataService.extractComponentsFromProducts(val.products))
          )
        };
      } else {

        res[index] = {
          amount: 0,
          percentage: 0,
          width: 0,
          bars: []
        };
      }

    });

    console.log('res', res);

    return res;
  }

  getData(input: WIAInputEntity) {

    //return Observable.of(rawData)
    //return this.getAjaxData(input).map(data => data.json())

    return Observable.of(this.getFromDataset(input))
      .map(this.parseRawData.bind(this))
      .map(response => {

        if (!response) {
          return;
        }

        return {
          graphData: response,
          legendData: this.getLegendFromGraphData(response)
        }
      });
  }

  createOptionsKey(params) {

    const products = params.products.sort((a, b) => {

      // sort by string
      return a.id < b.id ? -1 : 1;
    }).map(product => {

      return [
        product.id,
        ...product.attrs.map(el => el.value)
      ]
    });

    return [
      params.income,
      params.disability,
      params.usage,
      params.permDisability,
      products
    ]
  }

  uniqueValues(value, index, self) {

    return self.indexOf(value) === index;
  }

  getFromDataset(input: WIAInputEntity) {

    const key = JSON.stringify(this.createOptionsKey(input));

    if (mocks[key]) {


      console.info('Got from dataset: ' + key, 'in', mocks);
      return mocks[key];
    } else {

      console.error('Couldn\'t find result for key: ' + key, 'in', mocks)
    }
  }

  // getAjaxData(input: WIAInputEntity) {
  //
  //   // Parameters obj-
  //   let params: URLSearchParams = new URLSearchParams();
  //   params.set('income', String(input.income));
  //   params.set('permDisability', String(input.permDisability));
  //   params.set('disability', String(input.disability));
  //   params.set('usage', String(input.usage));
  //   params.set('products', JSON.stringify(input.products));
  //
  //   console.info('Getting data for', input);
  //
  //   return this.http.get('http://localhost:8000', {
  //     search: params
  //   });
  // }

  getLegendFromGraphData(graphData) {
    const components = [];
    const added = {};

    [].concat(...Object.keys(graphData).map(key => graphData[key].bars))
      .filter(el => el.percentage > 0)
      .forEach(el => {

        if (!added[el.id]) {

          added[el.id] = true;
          components.push(el);
        }
      });

    const res: any = {};

    const enabledGroups = components.map(el => el.meta.type).filter(this.uniqueValues);

    res.items = componentGroups.map(el => el.type).filter(type => enabledGroups.indexOf(type) > -1).reverse();
    res.groups = {};

    enabledGroups.forEach(groupId => {
      res.groups[groupId] = {
        items: components.filter(el => el.meta.type === groupId),
        meta: componentGroups.find(el => el.type === groupId)
      };
    });

    return res;
  }
}
