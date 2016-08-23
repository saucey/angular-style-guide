/**
 * AOV quick quote
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
  private mailUrl: string = 'http://ail.test.intra.aegon.nl/BS_Utilities_Communication_03Web/sca/BS_Utilities_Communication_03_ExpWS';
  private mailCredentials: string = 'AppAegonNLDrupalTST:dUACcFMYvwhnrnnfdq9h';
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
    "grossYearAmount": this.clientStorageAOV.grossYearAmount ||0,
    "startingTerm": this.clientStorageAOV.startingTerm || 30,
    "insuranceAmount": this.clientStorageAOV.insuranceAmount || 0,
    "grossMonthly": this.clientStorageAOV.grossMonthly || 0,
    "netMonthly": this.clientStorageAOV.netMonthly || 0
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

    if(location.host.search(".aegon.nl")<0) {
      // Mock: remove when in test
      this.emailButtonPending = false;
      this.reSendEmailShown = true;
      return false;  
    }

    var parser = new DOMParser(),
        oSerializer = new XMLSerializer(),
        XMLBodyString = '<soapenv:Envelope xmlns:bs="http://BS_Utilities_Communication/so/BS_Utilities_Communication" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Header><wsse:Security soapenv:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"><wsse:UsernameToken wsu:Id="UsernameToken-1" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"><wsse:Username>AppAegonNLDrupalTST</wsse:Username><wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">dUACcFMYvwhnrnnfdq9h</wsse:Password><wsse:Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">Ztsw326A7LCpn7fOtuzlQA==</wsse:Nonce><wsu:Created>2012-04-13T12:47:09.585Z</wsu:Created></wsse:UsernameToken></wsse:Security></soapenv:Header><soapenv:Body><bs:createSendCommunication><createSendCommunicationRequest><AILHEADER><CLIENTID>MdA01</CLIENTID><CORRELATIONID>##MigrationProject##</CORRELATIONID></AILHEADER><BATCH><BATCHID>16573</BATCHID><BATCHCONFIGID>1796011752</BATCHCONFIGID><COMMUNICATIE><HEADER><ZENDING><ZENDINGVOLGNUM>1</ZENDINGVOLGNUM><ZENDINGID>000001</ZENDINGID><ZENDINGBRANDING>Aegon</ZENDINGBRANDING><KANAAL><KANAALTYPE>EMAIL</KANAALTYPE><EMAIL><_AE_FROM>noreply@aegon.nl</_AE_FROM><_AE_RETURNADRES>MAbdulahpoer@aegon.nl</_AE_RETURNADRES></EMAIL></KANAAL><DOCUMENTSET><COMMUNICATIETAAL>NL</COMMUNICATIETAAL><_AE_DOCUMENT><DOCUMENTID>AOV_EMAIL</DOCUMENTID><VOLGNUM>1</VOLGNUM><DOCUMENTBRANDING>Aegon</DOCUMENTBRANDING><_AE_DOC_DATPUB>2001-01-01</_AE_DOC_DATPUB><COLOFON><RECHTSPERSOON>ADMINISTRATIEVE DIENSTVERLENING</RECHTSPERSOON><LABELUNIT>SCP</LABELUNIT></COLOFON><ARCHIVERING><ARCHIVEREN>false</ARCHIVEREN></ARCHIVERING></_AE_DOCUMENT></DOCUMENTSET><ADRESSERING><EMAIL>#</EMAIL></ADRESSERING><ONTVANGER><_AE_TYPEPARTIJ>BEDRIJF</_AE_TYPEPARTIJ><_AE_BEDRIJFSNAAM>Uw tussenpersoon</_AE_BEDRIJFSNAAM></ONTVANGER></ZENDING><HERKOMST><SYSTEEMID>HA</SYSTEEMID><GEBRUIKER></GEBRUIKER><OMGEVING>T</OMGEVING><BATCHNUMMER>123456786</BATCHNUMMER><BATCHFREQUENTIE>MAANDELIJKS</BATCHFREQUENTIE></HERKOMST></HEADER><_AE_DOC_DATA><DocumentData><Geboortedatum>#</Geboortedatum><Beroep>#</Beroep><Bruto_Jaarinkomen>#</Bruto_Jaarinkomen><Eigen_risicoperiode>#</Eigen_risicoperiode><Verzekerdbedrag>#</Verzekerdbedrag><Bruto_premie_permaand>#</Bruto_premie_permaand><Netto_premie_permaand>#</Netto_premie_permaand></DocumentData></_AE_DOC_DATA></COMMUNICATIE></BATCH></createSendCommunicationRequest></bs:createSendCommunication></soapenv:Body></soapenv:Envelope>';

    let XMLBody = parser.parseFromString(XMLBodyString,"text/xml");
    let headers = new Headers({
      'Content-Type': 'application/xml',
      'charset': 'utf-8',
      'SOAPAction': this.mailUrl
    });

    //Set SOAP Body with values
    XMLBody.getElementsByTagName("CORRELATIONID")[0].childNodes[0].nodeValue = "##" + Date.now() + "##";
    XMLBody.getElementsByTagName("ADRESSERING")[0].getElementsByTagName("EMAIL")[0].childNodes[0].nodeValue = this.emailAddress;
    XMLBody.getElementsByTagName("Geboortedatum")[0].childNodes[0].nodeValue = this.aov_qq_data.birthDate;
    XMLBody.getElementsByTagName("Beroep")[0].childNodes[0].nodeValue = this.aov_qq_data.profession;
    XMLBody.getElementsByTagName("Bruto_Jaarinkomen")[0].childNodes[0].nodeValue = this.aov_qq_data.grossYearAmount;
    XMLBody.getElementsByTagName("Eigen_risicoperiode")[0].childNodes[0].nodeValue = this.aov_qq_data.startingTerm;
    XMLBody.getElementsByTagName("Verzekerdbedrag")[0].childNodes[0].nodeValue = this.aov_qq_data.insuranceAmount;
    XMLBody.getElementsByTagName("Bruto_premie_permaand")[0].childNodes[0].nodeValue = this.aov_qq_data.grossMonthly;
    XMLBody.getElementsByTagName("Netto_premie_permaand")[0].childNodes[0].nodeValue = this.aov_qq_data.netMonthly;

    let options = new RequestOptions({headers: headers});

    this.http.post(this.mailUrl , oSerializer.serializeToString(XMLBody), options)
        .map(res => res.json())
        .catch(this.handleError)
        .subscribe(data => {
          this.emailButtonPending = false;
          this.reSendEmailShown = true;
        }, error => console.error(error));

    return false;
  }

}