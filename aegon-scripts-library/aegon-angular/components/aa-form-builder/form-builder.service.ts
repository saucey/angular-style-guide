import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from "@angular/http";
import {Observable} from 'rxjs/Observable';

@Injectable()
export class FormBuilderService {
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

  public call(serviceUrl: string, serviceCredential: string, reqData: any, reqBody: any): Promise<any> {

    /*return new Promise((resolve) => {
      resolve({});
    });*/

    let headers = new Headers({
      "Content-Type": "application/json",
      "Authorization" : `Basic ${serviceCredential}`
    });

    let options = new RequestOptions({headers: headers});

    for(let key in reqData) {
      console.log(reqData[key]);
      if(reqData[key]!=undefined && reqData[key]!="") {
        this.assign(reqBody, key, reqData[key]);
      }
    }

    let body:any = reqBody;

    // Gets the real data.
    let request = this.getApiData("post", serviceUrl, body, options);
    
    return request.then((response) => {
      return this.processResult(response);
    });
  }

  processResult(data) {
    console.log("Response: ", data);
    let response: any = data;

    return response;
  }

  assign(obj, prop, value) {
      if (typeof prop === "string")
          prop = prop.split(".");

      if (prop.length > 1) {
          var e = prop.shift();
          this.assign(
            obj[e] = (Object.prototype.toString.call(obj[e]) === "[object Object]" 
              || Object.prototype.toString.call(obj[e]) === "[object Array]") ? obj[e] : {},
            prop,
            value);
      } else
        obj[prop[0]] = value;
  }

  getPropByPath(obj, prop, defval){
      if (typeof defval == 'undefined') defval = null;
      prop = prop.split('.');
      for (var i = 0; i < prop.length; i++) {
          if(typeof obj[prop[i]] == 'undefined')
              return defval;
          obj = obj[prop[i]];
      }
      return obj;
  }
}