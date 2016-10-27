import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from "@angular/http";
import {Observable} from 'rxjs/Observable';

@Injectable()
export class GenericService {
	constructor(
		private http: Http
	) {
		this.init();
  	}
	init() {}
	/*
	 * If corresponds, get the data from
	 * the API.
	 */
	private getApiData(method: string, url: string, data: Object, options: Object): Promise<any> {
		console.log("%s calling...", url);
		return this.http[method](url, JSON.stringify(data), options || {})
			.map((res: Response) => {
				let response = res.json();
				console.log("%s response: ", url, response);
				return response;
			})
			.catch(this.handleError)
			.toPromise();
	}
	/*
	 * Error handling function
	 */
	private handleError(error: Response) {
		console.log('Server error', error);
		return Observable.throw(error.json().error || 'Server error');
	}

	public dipFixed(serviceUrl: string, serviceCredential: string): Promise<any> {
		let pensionInfo: any = clientStorage.session.getItem("pensionInfo") || null;

		if(pensionInfo===null) {
			return new Promise((resolve) => {
		      	resolve({});
		    	});
		}

		console.log("pensionInfo", pensionInfo);

		let headers = new Headers({'Content-Type': 'application/json', "Authorization" : `Basic ${serviceCredential}`});
    		let options = new RequestOptions({headers: headers});

		let body:any = {
		      "BScalculateRequest": {
		        "AILHEADER": {
		          "CLIENTID": "BS_PENSIOENOVEREENKOMST_ROA_Rest",
		          "CORRELATIONID": "##DIP SS##"
		        },
		        "DOSSIER": {
		          "REKENFACTOREN": {
		            "OVERGANG_OP_PP": 0.70,
		            "VERHOUDING_HOOG_LAAG": 0.75
		          },
		          "PENSIOENOVEREENKOMST": {
		            "STORTING_INLEG": {
		              "KOOPSOM": pensionInfo.pensionAmount,
		              "IND_VREEMDGELD": (pensionInfo.pensionLocation==1),
		              "IND_HERKOMST_OVL": false
		            },
		            "PENSIOENAANSPRAAK": {
		              "IND_OUDERDOMSPENSIOEN": true,
		              "IND_NABESTAANDENPENSIOEN": pensionInfo.insurablePartner,
		              "IND_HOOG_LAAGPENSIOEN": false,
		              "IND_PREPENSIOEN": false,
		              "BEGIN_DATUM_UITKERING": pensionInfo.startingDate,
		              "DUUR_UITKERING_JAREN": 5,
		              "TERMIJN_UITKERING": 1
		            }
		          },
		          "PARTIJ": [
		            {
		              "_AE_PERSOON": {
		                "VOLGNUM": 1,
		                "GESLACH": "M",
		                "GEBDAT": pensionInfo.birthDate
		              }
		            }
		          ]
		        }
		      }
		    };
		    if (pensionInfo.insurablePartner) {
		      body['BScalculateRequest']['DOSSIER']['PARTIJ'].push(
		        {
		          "_AE_PERSOON": {
		            "VOLGNUM": 2,
		            "GESLACH": "V",
		            "GEBDAT": pensionInfo.birthDateOfPartner
		          }
		        }
		      );
		    }

		// Gets the real data.
		let request = this.getApiData("post", serviceUrl, body, options);
		
		return request.then((response) => {
			return this.processResult(false, response);
		});
	}

	public dipHighLow(serviceUrl: string, serviceCredential: string): Promise<any> {
		let pensionInfo: any = clientStorage.session.getItem("pensionInfo") || null;

		if(pensionInfo===null) {
			return new Promise((resolve) => {
		      	resolve({});
		    	});
		}

		console.log("pensionInfo", pensionInfo);

		let headers = new Headers({'Content-Type': 'application/json', "Authorization" : `Basic ${serviceCredential}`});
    		let options = new RequestOptions({headers: headers});

		let body:any = {
		      "BScalculateRequest": {
		        "AILHEADER": {
		          "CLIENTID": "BS_PENSIOENOVEREENKOMST_ROA_Rest",
		          "CORRELATIONID": "##DIP SS##"
		        },
		        "DOSSIER": {
		          "REKENFACTOREN": {
		            "OVERGANG_OP_PP": 0.70,
		            "VERHOUDING_HOOG_LAAG": 0.75
		          },
		          "PENSIOENOVEREENKOMST": {
		            "STORTING_INLEG": {
		              "KOOPSOM": pensionInfo.pensionAmount,
		              "IND_VREEMDGELD": (pensionInfo.pensionLocation==1),
		              "IND_HERKOMST_OVL": false
		            },
		            "PENSIOENAANSPRAAK": {
		              "IND_OUDERDOMSPENSIOEN": true,
		              "IND_NABESTAANDENPENSIOEN": pensionInfo.insurablePartner,
		              "IND_HOOG_LAAGPENSIOEN": false,
		              "IND_PREPENSIOEN": false,
		              "BEGIN_DATUM_UITKERING": pensionInfo.startingDate,
		              "DUUR_UITKERING_JAREN": 5,
		              "TERMIJN_UITKERING": 1
		            }
		          },
		          "PARTIJ": [
		            {
		              "_AE_PERSOON": {
		                "VOLGNUM": 1,
		                "GESLACH": "M",
		                "GEBDAT": pensionInfo.birthDate
		              }
		            }
		          ]
		        }
		      }
		    };
		    if (pensionInfo.insurablePartner) {
		      body['BScalculateRequest']['DOSSIER']['PARTIJ'].push(
		        {
		          "_AE_PERSOON": {
		            "VOLGNUM": 2,
		            "GESLACH": "V",
		            "GEBDAT": pensionInfo.birthDateOfPartner
		          }
		        }
		      );
		    }

		// Gets the real data.
		let request = this.getApiData("post", serviceUrl, body, options);
		
		return request.then((response) => {
			return this.processResult(true, response);
		});
	}

	public vpuVariable(serviceUrl: string, serviceCredential: string): Promise<any> {
		//Mock
		return new Promise((resolve) => {
			resolve({
				"optimisticMine" : 10000,
				"neutralMine" : 10000,
				"pessimisticMine" : 10000,
				"optimisticPartner" : 10000,
				"neutralPartner" : 10000,
				"pessimisticPartner" : 10000
			});
		});
		// Gets the real data.
		//return this.getApiData("post", serviceUrl, {});
	}	

	public vpuFixed(serviceUrl: string, serviceCredential: string): Promise<any> {
		//Mock
		return new Promise((resolve) => {
			resolve({
				"optimisticMine" : 10000,
				"neutralMine" : 10000,
				"pessimisticMine" : 10000,
				"lifelongPartner" : 1000
			});
		});

		// Gets the real data.
		//return this.getApiData("post", serviceUrl, {});
	}

	processResult(highLow, data) {
	  console.log("processResult gets called", data);
	  let response: any = {};
	  let items: any[] = data['BScalculateResponse']['PENSIOENOVEREENKOMST']['PENSIOENAANSPRAAK'],
	    hlAmount = 0;
	  if (!Array.isArray(items)) {
	    items = [items];
	  }
	  items.forEach(item => {
	    let s = item['PENSIOENVORM'],
	      value = item['BEDRAG'];
	    value = value/12;
	    if (highLow) {
	      if (s === 'OPLL') {
	        hlAmount += parseFloat(value);
	        response.after5YearsMine = value;
	      } else if (s === 'OPT') {
	        hlAmount += parseFloat(value);
	      } else if (s === 'PPLL') {
	        response.lifelongPartner = value;
	      }
	    } else {
	      if (s === 'OPLL') {
	        response.lifelongMine = value;
	      } else if (s === 'PPLL') {
	        response.lifelongPartner = value;
	      }
	    }
	  });
	  if (highLow) {
	    response.first5YearsMine = String(hlAmount);
	  }

	  let pensionInfo: any = clientStorage.session.getItem("pensionInfo");
	  response.showButton = (pensionInfo.pensionLocation==1 && this.calculateFirst3Month(pensionInfo.startingDate));

	  return response;

	}

	private calculateFirst3Month(date: string) {
		let currentDate = new Date();
		let startingDate = new Date(date);
		let startingDateMonth = (currentDate.getFullYear()==startingDate.getFullYear()) ? startingDate.getMonth() : startingDate.getMonth()+12;

		return (startingDateMonth-currentDate.getMonth())<=3;
	}
}