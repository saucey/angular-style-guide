import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

const productsMetadata = require('./datasets/components.json');
const componentGroups = require('./datasets/componentsGroups.json');
const mocks = require('./datasets/demo.json');

interface InputParams {
  income: number,
  disability: number,
  permDisability: boolean,
  usage: number,
  products: Array<string>
}

@Injectable()
export class CalculatorDataService {

  constructor(
    private http: Http
  ) {}

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
    const cols = ['col1', 'col2', 'col3', 'col4'];

    cols.forEach((cal, index) => {

      const val = data.periods[index];

      if (val) {

        res[cal] = {
          amount: val.amount,
          label: val.label,
          percentage: val.percentage,
          width: CalculatorDataService.getColumnWidth(data, index),
          bars: CalculatorDataService.sortByPriority(
            this.attachMetadata(CalculatorDataService.extractComponentsFromProducts(val.products))
          )
        };
      } else {

        res[cal] = {
          amount: 0,
          percentage: 0,
          width: 0,
          bars: []
        };
      }

    });

    res.col34 = {
      width: res.col3.width + res.col4.width,
      bars: []
    };

    return res;
  }

  getData (input: InputParams) {

    //return Observable.of(rawData)
    //return this.getAjaxData(input).map(data => data.json())

   return Observable.of(this.getFromDataset(input))
      .map(this.parseRawData.bind(this));
  }


  createOptionsKey (params) {

    return [
      params.income,
      params.disability,
      params.usage,
      params.permDisability,
      params.products.length ? [
        params.products[0].id,
        [
          params.products[0].attrs[0].id,
          params.products[0].attrs[0].value
        ]
      ] : []
    ]
  }

  uniqueValues (value, index, self) {

    return self.indexOf(value) === index;
  }

  getFromDataset(input: InputParams) {

    const key = JSON.stringify(this.createOptionsKey(input));

    if (mocks[key]) {

      return mocks[key];
    } else {

      console.error('Couldn\'t find result for key: ' + key, 'in', mocks)
    }
  }

  // getAjaxData(input: InputParams) {
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

  getLegendFromGraphData (graphData) {
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

    const res:any = {};

    const enabledGroups = components.map(el => el.meta.type).filter(this.uniqueValues);

    res.items = componentGroups.map(el => el.type).filter(type => enabledGroups.indexOf(type) > -1);
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