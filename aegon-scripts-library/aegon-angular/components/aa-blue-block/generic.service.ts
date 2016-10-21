import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from 'rxjs/Observable';

@Injectable()
export class GenericService {
	constructor(private http: Http){
		this.init();
  	}
	init() {}
	/*
	 * If corresponds, get the data from
	 * the API.
	 */
	private getApiData(url: string, data: Object): Promise<any> {
		console.log("url: ", url);
		return this.http.get(url)
			.map((res: Response) => {
				let response = res.json();

				return this.processData(response);
			})
			.catch(this.handleError)
			.toPromise();
	}

	/*
	 * Process the data retrieved from back-end
	 */
	private processData(res: Object): number {
		console.log("Response data: ", res);
		return 0;

	}
	/*
	 * Error handling function
	 */
	private handleError(error: Response) {
		console.log('Server error', error);
		return Observable.throw(error.json().error || 'Server error');
	}

	public dipFixed(): any {
		// Gets the real data.
		console.log("dipFixed service");
		return this.getApiData('api/dipFixed', {});
	}

	public dipHighLow(data: Object): any {
		// Gets the real data.
		console.log("dipHighLow service");
		//return this.getApiData(data);
	}

	public vpuVariable(data: Object): any {
		// Gets the real data.
		console.log("vpuVariable service");
		//return this.getApiData(data);
	}	

	public vpuFixed(data: Object): any {
		// Gets the real data.
		console.log("vpuFixed service");
		//return this.getApiData(data);
	}
}