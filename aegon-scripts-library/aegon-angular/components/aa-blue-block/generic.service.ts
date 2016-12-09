import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from "@angular/http";
import {Observable} from 'rxjs/Observable';
import {AAMoneyPipe} from '../../pipes/money.pipe';

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

		let headers = new Headers({'Content-Type': 'application/json', "Authorization" : `Basic ${serviceCredential}`});
    		let options = new RequestOptions({headers: headers});

		let body:any = {
		      "BScalculateDIPRequest": {
		        "AILHEADER": {
		          "CLIENTID": "BS_PENSIOENOVEREENKOMST_ROA_Rest",
		          "CORRELATIONID": "##QQDIP_"+new Date().getTime() + "##"
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
		              "IND_NABESTAANDENPENSIOEN": (pensionInfo.insurablePartner) ? true : false,
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
		      body['BScalculateDIPRequest']['DOSSIER']['PARTIJ'].push(
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
			return this.processResultDIP(false, response);
		});
	}

	public dipHighLow(serviceUrl: string, serviceCredential: string): Promise<any> {
		let pensionInfo: any = clientStorage.session.getItem("pensionInfo") || null;

		if(pensionInfo===null) {
			return new Promise((resolve) => {
		      	resolve({});
		    	});
		}

		let headers = new Headers({'Content-Type': 'application/json', "Authorization" : `Basic ${serviceCredential}`});
    		let options = new RequestOptions({headers: headers});

		let body:any = {
		      "BScalculateDIPRequest": {
		        "AILHEADER": {
		          "CLIENTID": "BS_PENSIOENOVEREENKOMST_ROA_Rest",
		          "CORRELATIONID": "##QQDIP_"+new Date().getTime() + "##"
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
		              "IND_NABESTAANDENPENSIOEN": (pensionInfo.insurablePartner) ? true : false,
		              "IND_HOOG_LAAGPENSIOEN": true,
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
		      body['BScalculateDIPRequest']['DOSSIER']['PARTIJ'].push(
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
			return this.processResultDIP(true, response);
		});
	}

	public vpuVariable(serviceUrl: string, serviceCredential: string): Promise<any> {
		let pensionInfo: any = clientStorage.session.getItem("pensionInfo") || null;

		if(pensionInfo===null) {
			return new Promise((resolve) => {
		      	resolve({});
		    	});
		}

		let vpuVariable: boolean = (pensionInfo.insurablePartner) ? true : false;

		let headers = new Headers({'Content-Type': 'application/json', "Authorization" : `Basic ${serviceCredential}`});
    		let options = new RequestOptions({headers: headers});

		let body:any = {
		      "BScalculateVPURequest": {
		        "AILHEADER": {
		          "CLIENTID": "AEGONNL",
		          "CORRELATIONID": "##QQVPU_"+new Date().getTime() + "##"
		        },
		        "DOSSIER": {		          
		          "PENSIOENOVEREENKOMST": {
				"PENSIOENAANSPRAAK": {
		              "IND_OUDERDOMSPENSIOEN": true,
		              "IND_NABESTAANDENPENSIOEN": false,
		              "BEGIN_DATUM_UITKERING": pensionInfo.startingDate,
		              "IND_VARIABEL_NABESTAANDENPENSIOEN": vpuVariable
		            },
		            "STORTING_INLEG": {
		              "KOOPSOM": pensionInfo.pensionAmount,
		              "IND_VREEMDGELD": true
		            },
		          },
		          "PARTIJ": [
		            {
		              "_AE_PERSOON": {
		                "VOLGNUM": 1,
		                "GESLACH": "M",
		                "GEBDAT": pensionInfo.birthDate
		              }
		            }
		          ],
				"REKENFACTOREN": {
					"IND_NETTO_PENSIOEN": false
			 	}
		        }
		      }
		    };
		    if (pensionInfo.insurablePartner) {
		      body['BScalculateVPURequest']['DOSSIER']['PARTIJ'].push(
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
			return this.processResultVPU(false, response);
		});
	}	

	public vpuFixed(serviceUrl: string, serviceCredential: string): Promise<any> {
		let pensionInfo: any = clientStorage.session.getItem("pensionInfo") || null;

		if(pensionInfo===null) {
			return new Promise((resolve) => {
		      	resolve({});
		    	});
		}

		let vpuVariable: boolean = false;

		let headers = new Headers({'Content-Type': 'application/json', "Authorization" : `Basic ${serviceCredential}`});
    		let options = new RequestOptions({headers: headers});

		let body:any = {
		      "BScalculateVPURequest": {
		        "AILHEADER": {
		          "CLIENTID": "AEGONNL",
		          "CORRELATIONID": "##QQVPU_"+new Date().getTime() + "##"
		        },
		        "DOSSIER": {		          
		          "PENSIOENOVEREENKOMST": {
				"PENSIOENAANSPRAAK": {
		              "IND_OUDERDOMSPENSIOEN": true,
		              "IND_NABESTAANDENPENSIOEN": (pensionInfo.insurablePartner) ? true : false,
		              "BEGIN_DATUM_UITKERING": pensionInfo.startingDate,
		              "IND_VARIABEL_NABESTAANDENPENSIOEN": false
		            },
		            "STORTING_INLEG": {
		              "KOOPSOM": pensionInfo.pensionAmount,
		              "IND_VREEMDGELD": true
		            },
		          },
		          "PARTIJ": [
		            {
		              "_AE_PERSOON": {
		                "VOLGNUM": 1,
		                "GESLACH": "M",
		                "GEBDAT": pensionInfo.birthDate
		              }
		            }
		          ],
				"REKENFACTOREN": {
					"IND_NETTO_PENSIOEN": false
			 	}
		        }
		      }
		    };
		    if (pensionInfo.insurablePartner) {
		      body['BScalculateVPURequest']['DOSSIER']['PARTIJ'].push(
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
			return this.processResultVPU(true, response);
		});
	}

	processResultDIP(highLow, data) {
	  console.log("processResultDIP gets called", data);
	  let response: any = {};
	  let items: any[] = data['BScalculateDIPResponse']['DOSSIER']['PENSIOENOVEREENKOMST']['PENSIOENAANSPRAAK'],
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
	        response.after5YearsMine = "€ " + new AAMoneyPipe().transform(value, [false, true]);
	      } else if (s === 'OPT') {
	        hlAmount += parseFloat(value);
	      } else if (s === 'PPLL') {
	        response.lifelongPartner = "€ " + new AAMoneyPipe().transform(value, [false, true]);
	      }
	    } else {
	      if (s === 'OPLL') {
	        response.lifelongMine = "€ " + new AAMoneyPipe().transform(value, [false, true]);
	      } else if (s === 'PPLL') {
	        response.lifelongPartner = "€ " + new AAMoneyPipe().transform(value, [false, true]);
	      }
	    }
	  });
	  if (highLow) {
	    response.first5YearsMine = "€ " + new AAMoneyPipe().transform(hlAmount, [false, true]);
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

	processResultVPU(vast, data) {
	  console.log("processResultVPU gets called", data);
	  let response: any = {};
	  let items: any[] = data['BScalculateVPUResponse']['DOSSIER']['PENSIOENOVEREENKOMST']['PENSIOENAANSPRAAK'];
	  let itemsOpll: any = {};
	  let itemsPpll: any = {};

	if (!Array.isArray(items)) {
		items = [items];
	}
	
	items.forEach(item => {
	    let s = item['PENSIOENVORM'];
		for(var index in item) { 
			if(s === 'OPLL')
				itemsOpll[index] = item[index];
			else
				itemsPpll[index] = item[index];
		}
	});

	if(itemsPpll['BEDRAG']) {
		if(vast) {
			response.lifelongPartner = "€ " + new AAMoneyPipe().transform((itemsPpll['BEDRAG']/12), [false, true]);
		} else {
			response.firstYearsPartner = "€ " + new AAMoneyPipe().transform((itemsPpll['BEDRAG']/12), [false, true]);
			response.optimisticPartner = "€ " + new AAMoneyPipe().transform((itemsPpll['BEDRAG10JAAR_OPTIMISTISCH']/12), [false, true]);
			response.neutralPartner = "€ " + new AAMoneyPipe().transform((itemsPpll['BEDRAG10JAAR_STANDAARD']/12), [false, true]);
			response.pessimisticPartner = "€ " + new AAMoneyPipe().transform((itemsPpll['BEDRAG10JAAR_PESSIMISTISCH']/12), [false, true]);
		}
	}

	response.firstYearsMine = "€ " + new AAMoneyPipe().transform((itemsOpll['BEDRAG']/12), [false, true]);
	response.optimisticMine = "€ " + new AAMoneyPipe().transform((itemsOpll['BEDRAG10JAAR_OPTIMISTISCH']/12), [false, true]);
	response.neutralMine = "€ " + new AAMoneyPipe().transform((itemsOpll['BEDRAG10JAAR_STANDAARD']/12), [false, true]);
	response.pessimisticMine = "€ " + new AAMoneyPipe().transform((itemsOpll['BEDRAG10JAAR_PESSIMISTISCH']/12), [false, true]);

	  let pensionInfo: any = clientStorage.session.getItem("pensionInfo");
	  response.showButton = this.calculateFirst3Month(pensionInfo.startingDate);

	  return response;

	}
}