import { Injectable } from "@angular/core";
import { Http, URLSearchParams, Headers } from "@angular/http";
import { Observable } from "rxjs";
import { FNOLRepairshopResponse, FNOLRepairshopInput, FNOLRepairshopResults } from "../models";
import { generateCorrelationId } from "../../../../lib/util";


const SIMULATION_API = '/services/US_RestGatewayWeb/rest/requestResponse/BS_UtillitiesPostalArea_03/retrieveLocaties';
const GLASS_DAMAGE = 'GLASS';
const BODY_DAMAGE = 'BODY';
const GLASS_AND_BODY_DAMAGE = 'GLASS_AND_BODY';

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

  /**
   * Creates the repairshop damage object
   *
   * @param input
   * @returns {Object}
   */
  private createRepairshopDamageObject(input: FNOLRepairshopInput): Object {
    let damageObject = {
      _AE_ADRES: {
        _AE_LOCATIETYPE: '1',
        _AE_LOCATIEKENMERK: []
      }
    },
    blikschade = {
      NAAM: 'Blikschade',
      WAARDE: 'Nee'
    },
    glasschade = {
      NAAM: 'Glasschade',
      WAARDE: 'Nee'
    };

    switch (input.type) {
      case GLASS_DAMAGE:
        glasschade.WAARDE = 'Ja';
        break;
      case BODY_DAMAGE:
        blikschade.WAARDE = 'Ja';
        break;
      case GLASS_AND_BODY_DAMAGE:
        glasschade.WAARDE = 'Ja';
        blikschade.WAARDE = 'Ja';
        break;
    }

    damageObject._AE_ADRES._AE_LOCATIEKENMERK.push(blikschade);
    damageObject._AE_ADRES._AE_LOCATIEKENMERK.push(glasschade);

    return damageObject;
  }

  private generateSimulationRequestPayload(input: FNOLRepairshopInput): any {

    return {
        retrieveLocatiesRequest: {
        AILHEADER: {
          CLIENTID: 'Aegon.nl',
          CORRELATIONID: '##' + generateCorrelationId()
        },
        PARTIJ: [
          {
            _AE_ROL: 'VP',
            _AE_ADRES: {
              VOLGNUM: '1',
              PCODE: input.location,
              HUISNR: '365',
              STRAAT: 'newtonstraat',
              PLAATS: input.location,
              _AE_STRAAL: input.radius,
              _AE_LOCATIETYPE: '1'
            }
          },
          this.createRepairshopDamageObject(input)
        ]
      }
    }
  }

  private generateSimulationHeaders(): Headers {

    let auth = window.location.search.substr(1);

    try {
      auth = (window as any).Drupal.settings.qqService.http_authorization;
    } catch (err) {
      console.error(err);
    }
    const headers = new Headers();

    headers.append('Authorization', 'Basic ' + auth);

    return headers;
  }


  getRawData(input: FNOLRepairshopInput): Observable<FNOLRepairshopResponse> {

    const requestPayload = this.generateSimulationRequestPayload(input);
    const headerParams = this.generateSimulationHeaders();

    return this.http.post(SIMULATION_API, requestPayload, {
        headers: headerParams
      })
      .map(response => response.json());
  }

  getData(input: FNOLRepairshopInput): Observable<FNOLRepairshopResults> {
      return this
        .getRawData(input)
        .map(data => this.parseResponseData(data));
  }


}
