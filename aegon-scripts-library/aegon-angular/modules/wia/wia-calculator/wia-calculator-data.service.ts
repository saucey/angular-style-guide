import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { WIAInputModel } from "../wia-page/models/wia-input.model";

const PRODUCTS_METADATA = require('./datasets/components.json');
const COMPONENT_GROUPS = require('./datasets/componentsGroups.json');
const MOCKS = require('./datasets/demo.json');

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

  // Sort by priority, for the same priority numbers use reverse order
  private static sortByPriority(items) {
    return items.reverse().sort((a, b) => a.priority < b.priority);
  }

  attachMetadata(items) {
    items.forEach((item: any) => {
      item.meta = PRODUCTS_METADATA.find(el => el.id === item.id);
    });

    return items;
  }

  parseRawData(data) {
    // demo only
    if (!data) {
      return;
    }

    const RES: any = {};

    data.periods.forEach((val, index) => {

      if (val) {

        RES[index] = {
          id: index,
          amount: val.amount,
          label: val.label,
          percentage: val.percentage,
          bars: CalculatorDataService.sortByPriority(
            this.attachMetadata(CalculatorDataService.extractComponentsFromProducts(val.products))
          )
        };
      } else {

        RES[index] = {
          amount: 0,
          percentage: 0,
          width: 0,
          bars: []
        };
      }

    });

    return RES;
  }

  getData(input: WIAInputModel) {
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
    const PRODUCTS = params.products.sort((a, b) => {
      // sort by string
      return a.id < b.id ? -1 : 1;
    }).map(product => {
      console.log('product.attrs', product.attrs);
      return [
        product.id,
        product.attrs.length ? product.attrs[0].value :  null //@TODO handle attributes dynamically
      ]
    });

    return [
      params.income,
      params.disability,
      params.usage,
      params.permDisability,
      PRODUCTS
    ]
  }

  uniqueValues(value, index, self) {
    return self.indexOf(value) === index;
  }

  getFromDataset(input: WIAInputModel) {
    const OPTIONS_KEY = JSON.stringify(this.createOptionsKey(input));
    if (MOCKS[OPTIONS_KEY]) {
      return MOCKS[OPTIONS_KEY];
    } else {
      console.error('Couldn\'t find result for key: ' + OPTIONS_KEY, 'in', MOCKS)
    }
  }

  getLegendFromGraphData(graphData) {
    const COMPONENTS = [];
    const ADDED = {};

    [].concat(...Object.keys(graphData).map(key => graphData[key].bars))
      .filter(el => el.percentage > 0)
      .forEach(el => {
        if (!ADDED[el.id]) {
          ADDED[el.id] = true;
          COMPONENTS.push(el);
        }
      });

    const RES: any = {};
    const ENABLED_GROUPS = COMPONENTS.map(el => el.meta.type).filter(this.uniqueValues);

    RES.items = COMPONENT_GROUPS.map(el => el.type).filter(type => ENABLED_GROUPS.indexOf(type) > -1).reverse();
    RES.groups = {};

    ENABLED_GROUPS.forEach(groupId => {
      RES.groups[groupId] = {
        items: COMPONENTS.filter(el => el.meta.type === groupId),
        meta: COMPONENT_GROUPS.find(el => el.type === groupId)
      };
    });

    return RES;
  }
}
