/**
 * WiaContentService created on 10/17/16 1:36 PM.
 *
 * @description Manipulate the Wia static content
 * @author Florian Popa <florian@webgenerals.com>
 */
import { Injectable } from "@angular/core";
import { Http } from "@angular/http";

const CONTENT_DATA = require('./data/wia-content-static-data.json');

@Injectable()
export class WiaContentService {

  constructor(private http: Http) {
  }

  /**
   *
   * @TODO : Array<WiaTopicRow>
   */
  getWiaContent() {

    return CONTENT_DATA;

    // return this
    //  .http
    //  .get('http://localhost:80');
  }

}

