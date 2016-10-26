/**
 * WiaContentService created on 10/17/16 1:36 PM.
 *
 * @description Manipulate the Wia static content
 * @author Florian Popa <florian@webgenerals.com>
 */

import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { WiaTopicRow } from "./wia-content-entities/wia-topic-row.entity";
import { Observable, Subject } from "rxjs";

@Injectable()
export class WiaContentService {

  private wiaContentUrl = '/api/income123/content';

  constructor(private http: Http) {}

  /**
   * Retrieves the Wia content
   *
   * @returns {Observable<WiaTopicRow[]>}
   */
  public getWiaContent(): Observable<WiaTopicRow[]> {
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
