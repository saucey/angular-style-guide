/**
 * Summary quick quote
 */
import {Component, OnInit, Input} from 'angular2/core';
import {HTTP_PROVIDERS, Http, Headers, RequestOptions, Response} from "angular2/http";
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
// AA components
import {AAMoneyPipe} from "../../pipes/money.pipe";
import {AAPeriodPipe} from "../../pipes/period.pipe";
// Locals
import {template} from "./template";
import {options} from "./options";

@Component({
  selector: 'aa-qq-summary',
  directives: [
  ],
  template: template,
  providers: [HTTP_PROVIDERS],
  pipes: [AAMoneyPipe, AAPeriodPipe]
})

export class AAQQSummaryComponent implements OnInit {
  private mailUrl: string = options.mailUrl;
  private mailCredentials: string = options.mailCredentials;
  private summaryPath: string = '#';

  public options: any = options;
  public  emailAddress: string = "";
  public  emailAddressError: boolean;
  public  serviceError: boolean;
  public  pending: number = 0;
  public  emailButtonPending: boolean = false;
  public  reSendEmailShown: boolean = false;
  public clientStorageAOV: any = clientStorage.session.getItem("aovQQ") || {};

  public aov_qq_data: any = {
    "birthDate": this.clientStorageAOV.birthDate || "",
    "profession": this.clientStorageAOV.profession || "",
    "grossIncome": this.clientStorageAOV.grossIncome || 0,
    "startingTerm": this.clientStorageAOV.startingTerm || 30,
    "insuranceAmount": this.clientStorageAOV.insuranceAmount || 0,
    "grossPremium": this.clientStorageAOV.grossPremium || 0,
    "netPremium": this.clientStorageAOV.netPremium || 0
  };

  constructor(
    private http: Http
  ) {}

  ngOnInit() {

  }

  handleError(error: Response) {
    this.serviceError = true;
    console.error('Server error', error);
    this.pending -= 1;
    alert('Het is niet gelukt om gegevens op te vragen door een technisch probleem. Probeer het later opnieuw.')
    return Observable.throw('Server error');
  }

  gotoSummary() {
    // This needs to redirect to another page. use this.summaryPath
    window.location.href = this.summaryPath;
  }

  validateEmail() {
    var emailAddress_regexp = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    this.emailAddressError = false;

    if (this.emailAddress != "" && (this.emailAddress.length <= 5 || !emailAddress_regexp.test(this.emailAddress))) {
      this.emailAddressError = true;
    }

    return this.emailAddressError;
  }

  sendEmailClick() {
    this.emailButtonPending = true;
    if(this.validateEmail()) {
      this.emailButtonPending = false;
      return false;
    }

    // if(location.host.search(".aegon.nl")<0) {
    //   // Mock: remove when in test
    //   this.emailButtonPending = false;
    //   this.reSendEmailShown = true;
    //   return false;
    // }

    let dataReq = {
        "Email" : this.emailAddress,
        "Geboortedatum" : this.aov_qq_data.birthDate,
        "Beroep" : this.aov_qq_data.profession,
        "Bruto_Jaarinkomen" : this.aov_qq_data.grossIncome,
        "Eigen_risicoperiode" : this.aov_qq_data.startingTerm,
        "Verzekerdbedrag" : this.aov_qq_data.insuranceAmount,
        "Bruto_premie_permaand" : this.aov_qq_data.grossPremium,
        "Netto_premie_permaand" : this.aov_qq_data.netPremium
    };

    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    this.http.post(this.mailUrl, JSON.stringify(dataReq), options)
      .map(res => res.json())
      .catch(this.handleError)
      .subscribe(data => {
        this.emailButtonPending = false;
        this.reSendEmailShown = true;
        console.log(data);
      }, error => console.error(error));

      return false;
  }

}
