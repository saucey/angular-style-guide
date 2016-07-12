import {Injectable} from 'angular2/core';
import {Http, Response} from "angular2/http";
import {Observable} from 'rxjs/Observable';

interface DataFormat {
	months: number;
	nhg: boolean;
}

@Injectable()
export class InterestsService {
	/*
	 * Data format
	 */
	data: DataFormat = {months:0, nhg: false};
	
	constructor (private http: Http) {}

	// API url
	private intstUrl = '/particulier/feed/json/table';
	
	public getMarketInterestRate(data: DataFormat) {
		this.data = data;
		// Checks if it's local environment
		if(window.location.href.indexOf('localhost') > -1) {
			// Gets the mockdata.
			this.getMockData();
		} 
		else {
			// Gets the real data.
			this.getAPIdata();
		}
	}

	/*
	 * If corresponds, get the data from
	 * the API.
	 */
	private getAPIdata(): Promise<any> {
		return this.http.get(this.intstUrl)
			.map(this.processData)
			.catch(this.handleError)
			.toPromise();
	}

	/*
	 * Process the data retrieved from back-end
	 */
	private processData(res: Response) {
		let response = res.json();
		let table: Array<any> = [];

		if(this.data.nhg) {
			response.forEach(i => {
				if(response[i].title == 'Hypotheek zonder NHG') {
					table = response[i].Table;
				}
			});
		} 
		else {
			response.forEach(i => {
				if(response[i].title == 'Actuele Hypotheekrente') {
					table = response[i].Table;
				}
			});
		}
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
	    	resolve(result);
	    }).then(this.processData, this.handleError);
	}
}