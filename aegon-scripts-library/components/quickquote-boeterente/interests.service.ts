import {Injectable} from 'angular2/core';
import {Http, Response} from "angular2/http";
import {Observable} from 'rxjs/Observable';
import {parseNumber} from '../angular-components/input-number.component';
interface DataFormat {
	months: number;
	nhg: boolean;
}

@Injectable()
export class InterestsService {
	/*
	 * Data format
	 */
	private inputData: DataFormat = {months:0, nhg: false};
	
	constructor (private http: Http) {}

	// API url
	private intstUrl = '/particulier/feed/json/table';
	
	public getMarketInterestRate(data: DataFormat): any {
		console.log(data);
		this.inputData = data;
		// Checks if it's local environment
		if(window.location.href.indexOf('localhost') > -1) {
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
		let $this = this;
		return this.http.get(this.intstUrl)
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
		let table: Array<any> = [],
			intsTable: Object = {},
			months: number = this.inputData.months,
			years: number = months / 12,
			interest: number;

		// Choose the interest table depending on NHG.
		for(let i in res) {
			if(this.inputData.nhg) {
				if(res[i].Title == 'Actuele Hypotheekrente') {
					table = res[i].Table;
				}
			} 
			else {
				if(res[i].Title == 'Hypotheek zonder NHG') {
					table = res[i].Table;
				}
			}
		}

		// Data formatting.
		for(let i in table) {
			let intPer: Object,
				tempPerc: Array<any> = [],
				key: string;
			// Loop through the keys
			for(let p in table[i]) {
				let percRegExp = /^[0-9]+\,[0-9]+%$/;

				if(table[i][p].match(percRegExp)) {
					let frmtNum = parseNumber(table[i][p].replace('%', ''));
					// Push the number to the array of interests.
					tempPerc.push(frmtNum);
				} else {
					// If the key contains numbers.
					if(/\d/.test(table[i][p])) {
						// Strip all text in key.
						key = table[i][p].replace(/[^0-9 ]/g, '');
						// Strip extra spaces.
						key = key.trim();
						// Replace spaces with hyphen.
						key = key.replace('  ', '-');
					} else {
						// If it's only text, we'll leave it as is.
						key = table[i][p];
					}
				}
			}

			if(tempPerc.length > 0) {
				tempPerc.sort(function(a, b) {
					return a - b;
				});

				intsTable[key] = tempPerc[0];
			}
		}
		/*
		 * Special calculation for periods
		 * from 2 up to 5 years.
		 */
		if( years >= 2 && years <= 5) {
			let twoYearsInts = intsTable.hasOwnProperty('2') ? (intsTable['2'] / 100) : 0,
				fiveYearsInts = intsTable.hasOwnProperty('5') ? (intsTable['5'] / 100) : 0,
				period = months - 24;

			interest = +((twoYearsInts + ((period / 36) * (fiveYearsInts - twoYearsInts))).toFixed(2));

		}
		else if(years < 2) {
			interest = intsTable.hasOwnProperty('2') ? (intsTable['2'] / 100) : 0;
		}
		else if(years > 5) {
			// Round the years value up.
			years =  Math.ceil(years);
			// The highest a person can pay a mortgage
			// period in years.
			let highest: number = 30; 
			if(years > highest) {
				// If it's more than 30 years
				years =  highest;
			}
			for(let p in intsTable) {
				// It's more than 5 years so the key will have -
				if(p.indexOf('-') > -1) {
					let fromTo = p.split('-');

					if(years >= parseInt(fromTo[0]) && years <= parseInt(fromTo[1])) {
						interest = intsTable[p];
					} 
				}
			}
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
				"Title": "Actuele Hypotheekrente",
				"Nid": "36374",
				"Table": [
					{
						"U wilt uw rente...": "variabel",
						"Rente tot en met 67,5% van de marktwaarde": "2,15%",
						"Rente tot en met 81% van de marktwaarde": "2,25%",
						"Rente bij meer dan 81% van de marktwaarde": "2,70%"
					},
					{
						"U wilt uw rente...": "2 jaar vast",
						"Rente tot en met 67,5% van de marktwaarde": "2,00%",
						"Rente tot en met 81% van de marktwaarde": "2,10%",
						"Rente bij meer dan 81% van de marktwaarde": "2,55%"
					},
					{
						"U wilt uw rente...": "5 jaar vast",
						"Rente tot en met 67,5% van de marktwaarde": "2,20%",
						"Rente tot en met 81% van de marktwaarde": "2,30%",
						"Rente bij meer dan 81% van de marktwaarde": "2,75%"
					},
					{
						"U wilt uw rente...": "6 t/m 10 jaar vast",
						"Rente tot en met 67,5% van de marktwaarde": "2,40%",
						"Rente tot en met 81% van de marktwaarde": "2,50%",
						"Rente bij meer dan 81% van de marktwaarde": "2,95%"
					},
					{
						"U wilt uw rente...": "11 t/m 15 jaar vast",
						"Rente tot en met 67,5% van de marktwaarde": "2,70%",
						"Rente tot en met 81% van de marktwaarde": "2,80%",
						"Rente bij meer dan 81% van de marktwaarde": "3,25%"
					},
					{
						"U wilt uw rente...": "16 t/m 20 jaar vast",
						"Rente tot en met 67,5% van de marktwaarde": "2,80%",
						"Rente tot en met 81% van de marktwaarde": "2,90%",
						"Rente bij meer dan 81% van de marktwaarde": "3,35%"
					},
					{
						"U wilt uw rente...": "21 t/m 30 jaar vast",
						"Rente tot en met 67,5% van de marktwaarde": "3,15%",
						"Rente tot en met 81% van de marktwaarde": "3,25%",
						"Rente bij meer dan 81% van de marktwaarde": "3,70%"
					}
				],
				"Table footer": "<p>De rentepercentages gelden per 2 maart 2016 en zijn onder voorbehoud van typefouten</p>\n"
			},
			{
				"Title": "Hypotheek zonder NHG",
				"Nid": "36584",
				"Table": [
					{
						"U wilt uw rente...": "variabel",
						"Rente tot en met 67,5% van de marktwaarde": "2,15%",
						"Rente tot en met 81% van de marktwaarde": "2,25%",
						"Rente bij meer dan 81% van de marktwaarde": "2,70%"
					},
					{
						"U wilt uw rente...": "2 jaar vast",
						"Rente tot en met 67,5% van de marktwaarde": "2,00%",
						"Rente tot en met 81% van de marktwaarde": "2,10%",
						"Rente bij meer dan 81% van de marktwaarde": "2,55%"
					},
					{
						"U wilt uw rente...": "5 jaar vast",
						"Rente tot en met 67,5% van de marktwaarde": "2,20%",
						"Rente tot en met 81% van de marktwaarde": "2,30%",
						"Rente bij meer dan 81% van de marktwaarde": "2,75%"
					},
					{
						"U wilt uw rente...": "6 t/m 10 jaar vast",
						"Rente tot en met 67,5% van de marktwaarde": "2,40%",
						"Rente tot en met 81% van de marktwaarde": "2,50%",
						"Rente bij meer dan 81% van de marktwaarde": "2,95%"
					},
					{
						"U wilt uw rente...": "11 t/m 15 jaar vast",
						"Rente tot en met 67,5% van de marktwaarde": "2,70%",
						"Rente tot en met 81% van de marktwaarde": "2,80%",
						"Rente bij meer dan 81% van de marktwaarde": "3,25%"
					},
					{
						"U wilt uw rente...": "16 t/m 20 jaar vast",
						"Rente tot en met 67,5% van de marktwaarde": "2,80%",
						"Rente tot en met 81% van de marktwaarde": "2,90%",
						"Rente bij meer dan 81% van de marktwaarde": "3,35%"
					},
					{
						"U wilt uw rente...": "21 t/m 30 jaar vast",
						"Rente tot en met 67,5% van de marktwaarde": "3,15%",
						"Rente tot en met 81% van de marktwaarde": "3,25%",
						"Rente bij meer dan 81% van de marktwaarde": "3,70%"
					}
				],
				"Table footer": "<p><span style=\"line-height: 20.8px;\">De rentepercentages gelden per 2 maart 2016 en zijn onder voorbehoud van typefouten.</span></p>\n"
			},
			{
				"Title": "DFRRE",
				"Nid": "36598",
				"Table": [
					{
						"U wilt uw rente...": "variabel",
						"Rente tot en met 67,5% van de marktwaarde": "2,16%",
						"Rente tot en met 81% van de marktwaarde": "2,26%",
						"Rente bij meer dan 81% van de marktwaarde": "2,71%"
					},
					{
						"U wilt uw rente...": "2 jaar vast",
						"Rente tot en met 67,5% van de marktwaarde": "2,01%",
						"Rente tot en met 81% van de marktwaarde": "2,11%",
						"Rente bij meer dan 81% van de marktwaarde": "2,56%"
					},
					{
						"U wilt uw rente...": "5 jaar vast",
						"Rente tot en met 67,5% van de marktwaarde": "2,21%",
						"Rente tot en met 81% van de marktwaarde": "2,31%",
						"Rente bij meer dan 81% van de marktwaarde": "2,76%"
					},
					{
						"U wilt uw rente...": "6 t/m 10 jaar vast",
						"Rente tot en met 67,5% van de marktwaarde": "2,40%",
						"Rente tot en met 81% van de marktwaarde": "2,50%",
						"Rente bij meer dan 81% van de marktwaarde": "2,95%"
					},
					{
						"U wilt uw rente...": "11 t/m 15 jaar vast",
						"Rente tot en met 67,5% van de marktwaarde": "2,70%",
						"Rente tot en met 81% van de marktwaarde": "2,80%",
						"Rente bij meer dan 81% van de marktwaarde": "3,25%"
					},
					{
						"U wilt uw rente...": "16 t/m 20 jaar vast",
						"Rente tot en met 67,5% van de marktwaarde": "2,80%",
						"Rente tot en met 81% van de marktwaarde": "2,90%",
						"Rente bij meer dan 81% van de marktwaarde": "3,35%"
					},
					{
						"U wilt uw rente...": "21 t/m 30 jaar vast",
						"Rente tot en met 67,5% van de marktwaarde": "3,15%",
						"Rente tot en met 81% van de marktwaarde": "3,25%",
						"Rente bij meer dan 81% van de marktwaarde": "3,70%"
					}
				],
				"Table footer": null
			}
		];

	    return new Promise((resolve) => {
	      resolve(this.processData(result));
	    });
	}
}