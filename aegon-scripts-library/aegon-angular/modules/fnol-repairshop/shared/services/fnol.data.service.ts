import { Injectable } from "@angular/core";
import { Http, URLSearchParams } from "@angular/http";
import { Observable } from "rxjs";
import { FNOLRepairshopResponse, FNOLRepairshopInput, FNOLRepairshopResults } from "../models";
import { generateCorrelationId } from "../../../../lib/util";


const SIMULATION_API = '/sites/aegonnl/public_files/fnol-results.json';


@Injectable()
export class FnolRepairshopService {

  constructor(private http: Http) {
  }

  //extract ranking value from the raw response
  private getRanking(item) {

    const ranking = item._AE_ADRES._AE_LOCATIEKENMERK.find(el => el.NAAM === 'Ranking');
    return ranking ? ranking.WAARDE : null;
  }

  private parseResponseData(data: FNOLRepairshopResponse): FNOLRepairshopResults {

    const items = data.retrieveLocatiesResponse.PARTIJ;

    return items.map(item => {
      return {
        name: item.ANAAM,
        mail: item.EMAIL,
        phone: item.TELNUM,
        id: item.VOLGNUM,
        address: {
          latitude: item._AE_ADRES.GEOBRED,
          longitude: item._AE_ADRES.GEOLENG,
          houseNumber: item._AE_ADRES.HUISNR,
          postCode: item._AE_ADRES.PCODE,
          city: item._AE_ADRES.PLAATS,
          street: item._AE_ADRES.STRAAT,
          radius: item._AE_ADRES._AE_STRAAL,
          type: item._AE_ADRES._AE_LOCATIETYPE,
        },
        ranking: this.getRanking(item),
        website: item._AE_ONDERNEMING.WEBSITE
      }
    });
  }

  private generateSimulationQueryParams(input: FNOLRepairshopInput): URLSearchParams {

    const params: URLSearchParams = new URLSearchParams();

    params.set('location', input.location);
    params.set('radius', input.radius.toString());
    params.set('type', input.type);
    params.set('correlationId', generateCorrelationId());

    return params;
  }

  getRawData(input: FNOLRepairshopInput): Observable<FNOLRepairshopResponse> {

    const queryParams = this.generateSimulationQueryParams(input);

    return this.http.get(SIMULATION_API, {
        search: queryParams
      })
      .map(response => response.json());
  }

  getData(input: FNOLRepairshopInput): Observable<FNOLRepairshopResults> {

    return this.getRawData(input)
      .map(data => this.parseResponseData(data));
  }

}
