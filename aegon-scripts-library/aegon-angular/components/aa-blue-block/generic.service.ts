import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from 'rxjs/Observable';

@Injectable()
export class GenericService {
	constructor (private http: Http) {}
	/*
	 * Retrieves the interest table from the API
	 *
	 * @param data {Object}:
	 *  - months {number} = the length of the mortgage in months
	 *	- nhg {boolean} = whether the mortgage is nhg
	 *	- lowest {boolean} (optional) = which interest to get
	 */
	public getMarketInterestRate(): any {
			// Gets the real data.
			return this.getAPIdata();
	}

	/*
	 * If corresponds, get the data from
	 * the API.
	 */
	private getAPIdata(): Promise<any> {
		return this.http.get('url')
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
		return 0;

	}
	/*
	 * Error handling function
	 */
	private handleError(error: Response) {
		console.log('Server error', error);
		return Observable.throw(error.json().error || 'Server error');
	}
}
