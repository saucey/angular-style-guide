import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from 'rxjs/Observable';
import {parseNumber} from '../angular-components/input-number.component';
interface DataFormat {
	months: number;
	nhg: boolean;
	lowest?: boolean;
}

@Injectable()
export class InterestsService {
	/*
	 * Data format
	 */
	private defaultData: DataFormat = {months:0, nhg: false, lowest: true};
	private inputData: DataFormat;

	constructor (private http: Http) {}

	// API url
	private intstUrl = '/particulier/feed/json/mortgage';

	/*
	 * Retrieves the interest table from the API
	 *
	 * @param data {Object}:
	 *  - months {number} = the length of the mortgage in months
	 *	- nhg {boolean} = whether the mortgage is nhg
	 *	- lowest {boolean} (optional) = which interest to get
	 */
	public getMarketInterestRate(data: DataFormat): any {
		this.inputData = Object.assign(this.defaultData, data);
		// Checks if it's local environment
		if(window.location.hostname.indexOf('localhost') > -1) {
			// Gets the mockdata.
			return this.getMockData();
		}
		else {
			// Gets the real data.
			return this.getAPIdata();
		}
	}

	/*
	 * If corresponds, get the data from
	 * the API.
	 */
	private getAPIdata(): Promise<any> {
		// Endpoint parameters
		let section = this.inputData.nhg ? '/hypotheek-met-nhg' : '/hypotheek-zonder-nhg';
		let low = this.inputData.lowest ? '/low' : '/high';

		let finalURL = this.intstUrl + section + '/' + this.inputData.months + low;

		return this.http.get(finalURL)
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
		let table = res[0].table,
			interest: number = 0;

		if(table) {
			// Data formatting.
			interest = table.Interest;
		}
		return interest;

	}
	/*
	 * Error handling function
	 */
	private handleError(error: Response) {
		console.log('Server error', error);
		return Observable.throw(error.json().error || 'Server error');
	}
	/*
	 * Returns a mock of the API structure
	 */
	private getMockData(): Promise<any> {
		let result = [
			{
				"title": "Hypotheek zonder NHG",
				"nid": 39122,
				"tableid": "hypotheek-zonder-nhg",
				"table": {
					"Interest": 2.4
				},
				"footer": null
			}
		];

	    return new Promise((resolve) => {
	      resolve(this.processData(result));
	    });
	}
}
