import { Injectable } from "@angular/core";
import { Http, URLSearchParams } from "@angular/http";
import { WIAInputModel } from "../wia-page/models/wia-input.model";
import { generateCorrelationId } from "../../../lib/util";

const SIMULATION_API = '/sites/aegonnl/public_files/simulation.json';

const CATEGORIES_MAP = {
  Statutory: 1,
  Salary: 2,
  Aegon: 3
};

@Injectable()
export class CalculatorDataService {

  constructor(private http: Http) {
  }

  parseRawData(input: WIAInputModel, data) {

    // sort items based on their category: statutory < salary < aegon
    data.sort((a, b) => {
      return CATEGORIES_MAP[a.componentId] < CATEGORIES_MAP[b.componentId];
    });

    const result = data.reduce((res, item) => {

      item.id = `${item.componentId}-${item.productId}-${item.benefitId}`;
      item.category = CATEGORIES_MAP[item.componentId];
      item.percentage = item.amountYearly / input.income * 100;

      res[item.period].bars.push(item);
      res[item.period].amountYearly += item.amountYearly;
      res[item.period].amountMonthly += item.amountMonthly;

      return res;
    }, {
      1: {
        bars: [],
        amountYearly: 0,
        amountMonthly: 0
      },
      2: {
        bars: [],
        amountYearly: 0,
        amountMonthly: 0
      },
      3: {
        bars: [],
        amountYearly: 0,
        amountMonthly: 0
      },
      4: {
        bars: [],
        amountYearly: 0,
        amountMonthly: 0
      }
    });

    console.log('input', input);
    console.log('results', result);
    console.log('parseRawData', data);

    return {
      grouped: result,
      initial: data
    }
  }

 //Get product first attribute which is sent with the simulation request
  private getProductDynamicAttr (productId: string, input: WIAInputModel): string {
    const el = input.products.find(el => el.id === productId);
    return el && el.attrs && el.attrs[0] ? el.attrs[0].value.toString() : 'true';
  }

  private generateSimulationQueryParams (input: WIAInputModel): URLSearchParams {

    const params: URLSearchParams = new URLSearchParams();
    params.set('income', input.income.toString());
    params.set('correlationId', generateCorrelationId());

    input.productsIds.forEach(productId => {
      params.set(productId, this.getProductDynamicAttr(productId, input));
    });

    return params;
  }

  getData(input: WIAInputModel) {

    return this.http.get(SIMULATION_API, {
      search: this.generateSimulationQueryParams(input)
    })
      .map(response => response.json())
      .map(data => this.getFromDataset(input, data))
      .map(data => this.parseRawData(input, data))
      .map(({ grouped, initial }) => {

        return {
          graphData: grouped,
          legendData: initial.map(el => el.category).filter(this.uniqueValues)
        }
      });
  }

  private createOptionsKey({disability, usage = null, permDisability = null} : WIAInputModel) {

    return `_${disability}-${usage}-${permDisability}`;
  }

  private uniqueValues(value, index, self) {
    return self.indexOf(value) === index;
  }

  private getFromDataset(input: WIAInputModel, data) {

    const OPTIONS_KEY = this.createOptionsKey(input);
    if (data[OPTIONS_KEY]) {
      return data[OPTIONS_KEY];
    } else {
      console.error('Couldn\'t find result for key: ' + OPTIONS_KEY, 'in', data)
    }
  }
}
