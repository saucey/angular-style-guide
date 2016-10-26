import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";
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
	private getApiData(url: string, data: Object): Promise<any> {
		console.log("%s calling...", url);
		return this.http.get(url)
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

	public dipFixed(serviceUrl: string): Promise<any> {
		// Gets the real data.
		let request = this.getApiData(serviceUrl, {});
		
		return request.then((response) => {
		    return {
		    	"lifelongMine" : 1000,
		    	"lifelongPartner" : 500
		    };
		});
	}

	public dipHighLow(serviceUrl: string): Promise<any> {
		// Gets the real data.
		let request = this.getApiData(serviceUrl, {});
		
		return request.then((response) => {
		    return {
		    	"first5YearsMine" : 10000,
		    	"after5YearsMine" : 2500,
		    	"lifelongPartner" : 500
		    };
		});
	}

	public vpuVariable(serviceUrl: string): Promise<any> {
		// Gets the real data.
		return this.getApiData(serviceUrl, {});
	}	

	public vpuFixed(serviceUrl: string): Promise<any> {
		// Gets the real data.
		return this.getApiData(serviceUrl, {});
	}
}