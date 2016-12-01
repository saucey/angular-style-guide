import { Injectable } from "@angular/core";
import { Http, URLSearchParams, Headers } from "@angular/http";
import { WIAInputModel } from "../wia-page/models/wia-input.model";
import { generateCorrelationId } from "../../../lib/util";
import { Observable } from "rxjs";
import { SimulationDataset, SimulationKey, Simulation } from "./models/simulation-dataset";

const SIMULATION_API = '/services/TS_WIAWeb/rest/simulate';

const CATEGORIES_MAP = {
  StatutoryBenefits: 1, //statutory
  OwnIncomeBenefits: 2, //salary
  InsuranceBenefits: 3 //aegon products
};

@Injectable()
export class CalculatorDataService {

  // Simulation data cache for current input
  simulationDataset: { [key:string]: SimulationDataset; } = {};

  // Pending requests
  // In case getData methods is called multiple times only one request is send
  pendingRequests: { [key:string]: Observable<any>; } = {};

  constructor(private http: Http) {
  }

  parseRawData(input: WIAInputModel, data) {

    // sort items based on their category: statutory < salary < aegon
    data.sort((a, b) => {
      return CATEGORIES_MAP[a.componentId] < CATEGORIES_MAP[b.componentId];
    });

    const result = data.reduce((res, item) => {

      //convert string to numbers
      item.amountMonthly = +item.amountMonthly;
      item.amountYearly = +item.amountYearly;
      item.period = +item.period;

      item.id = `${item.componentId}-${item.productId}-${item.benefitId}`;
      item.category = CATEGORIES_MAP[item.componentId];
      item.percentage = item.amountYearly / input.income * 100;

      res[item.period].bars.push(item);
      res[item.period].amountYearly += item.amountYearly;
      res[item.period].amountMonthly += item.amountMonthly;
      res[item.period].categoryYearlyAmounts[item.category] += item.amountYearly;
      return res;
    }, {
      1: {
        bars: [],
        categoryYearlyAmounts: {
          1: 0,
          2: 0,
          3: 0
        },
        amountYearly: 0,
        amountMonthly: 0
      },
      2: {
        bars: [],
        categoryYearlyAmounts: {
          1: 0,
          2: 0,
          3: 0
        },
        amountYearly: 0,
        amountMonthly: 0
      },
      3: {
        bars: [],
        categoryYearlyAmounts: {
          1: 0,
          2: 0,
          3: 0
        },
        amountYearly: 0,
        amountMonthly: 0
      },
      4: {
        bars: [],
        categoryYearlyAmounts: {
          1: 0,
          2: 0,
          3: 0
        },
        amountYearly: 0,
        amountMonthly: 0
      }
    });

    return {
      grouped: result,
      initial: data
    }
  }

 //Get product dynamic (editable) attribute which is sent with the simulation request
  private getProductDynamicAttr (productId: string, input: WIAInputModel): string {
    const el = input.products.find(el => el.id === productId);
    if (el && el.attrs) {
      let dynamicAttr = el.attrs.find(attr => attr.visible);

      return  dynamicAttr ? dynamicAttr.value.toString() : 'true';
    }

    return 'true';
  }

  private generateSimulationQueryParams (input: WIAInputModel): URLSearchParams {

    const params: URLSearchParams = new URLSearchParams();
    params.set('income', input.income.toString());
    params.set('correlationId', generateCorrelationId());
    params.set('clientId', 'Aegonnl');

    input.productsIds.forEach(productId => {
      params.set(productId, this.getProductDynamicAttr(productId, input));
    });

    return params;
  }


  private generateSimulationHeaders(): Headers {

    const headers = new Headers();
    //temporary solution until Drupal implementation of auth token is done
    headers.append('Authorization', 'Basic ' + window.location.search.substr(1));

    return headers;
  }

  getData(input: WIAInputModel): Observable<SimulationDataset> {

    const inputKey = this.createRequestKey(input);

    // Resolve cached response
    if (this.simulationDataset[inputKey]) {
      return Observable.of(this.simulationDataset[inputKey])
    }

    // Resolve requests that are actually in progress
    if (this.pendingRequests[inputKey]) {
      return this.pendingRequests[inputKey];
    }


    const queryParams = this.generateSimulationQueryParams(input);
    const headerParams = this.generateSimulationHeaders();
    const request = this.http.get(SIMULATION_API, {
      search: queryParams,
      headers: headerParams
    })
      .share()
      .map(response => {

        const json = response.json();

        this.setDataset(inputKey, json);
        this.pendingRequests[inputKey]= null;

        return json;
      });


    this.pendingRequests[inputKey] = request;

    return request;
  }

  private setDataset (key: SimulationKey, data: SimulationDataset): void {
    this.simulationDataset[key] = data;
  }

  private createRequestKey (input: WIAInputModel): SimulationKey {
    const keyParts = [];
    keyParts.push(input.income);

    input.productsIds.forEach(productId => {
      keyParts.push(productId);
      keyParts.push(this.getProductDynamicAttr(productId, input));
    });

    return JSON.stringify(keyParts);
  }

  public getScenario (input: WIAInputModel) {

    return new Promise((resolve, reject) => {

      this.getData(input).subscribe(data => {

        console.log('getScenario', data, input);
        const scenarioData = this.getFromDataset(input, data);
        const scenarioDataInPeriods = this.parseRawData((data as any).request, scenarioData);

        resolve({
          graphData: scenarioDataInPeriods.grouped,
          legendData: scenarioDataInPeriods.initial.map(el => el.category).filter(this.uniqueValues)
        });
      });
    });
  }

  private createOptionsKey({disability, usage = null, permDisability = null} : WIAInputModel): string {

    return `_${disability}-${usage}-${permDisability}`;
  }

  private uniqueValues(value, index, self) {
    return self.indexOf(value) === index;
  }

  private getFromDataset(input: WIAInputModel, data): Simulation {

    const OPTIONS_KEY = this.createOptionsKey(input);
    if (data[OPTIONS_KEY]) {
      return data[OPTIONS_KEY];
    } else {
      console.error('Couldn\'t find result for key: ' + OPTIONS_KEY, 'in', data)
    }
  }
}
