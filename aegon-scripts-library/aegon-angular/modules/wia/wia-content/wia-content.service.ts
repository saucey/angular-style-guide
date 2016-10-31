/**
 * WiaContentService created on 10/17/16 1:36 PM.
 *
 * @description Manipulate the Wia static content
 * @author Florian Popa <florian@webgenerals.com>
 */

import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { WiaTopicRowModel } from "./models/wia-topic-row.model";
import { Observable, Subject } from "rxjs";

@Injectable()
export class WiaContentService {

  private wiaContentUrl = '/sites/aegonnl/public_files/wia.json';

  constructor(private http: Http) {}

  /**
   * Retrieves the Wia content
   *
   * @returns {Observable<WiaTopicRowModel[]>}
   */
  public getWiaContent(): Observable<WiaTopicRowModel[]> {
    return this
      .http
      .get(this.wiaContentUrl)
      .map(res => res.json())
      .catch(this.handleError);
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }
}
