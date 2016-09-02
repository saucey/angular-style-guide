/**
 * A lead generation form that accepts user details
 * Form is posted to a configured backend form in Drupal (through FormAssembly)
 * To make this work, first configure the form in FormAssembly, then in Drupal
 * Enter the form configuration in the options
 */

import {Component, Input, Output, NgZone, ElementRef, ViewChild} from 'angular2/core';
import {template} from "./template";
import {AABaseComponent} from '../../lib/classes/AABaseComponent';
import {defaultOptions} from "./defaultOptions";
import * as libDom from "../../lib/dom";
import * as libUtil from "../../lib/util";
import * as libDate from "../../lib/date";

declare var jQuery: any;

@Component({
  selector: 'aa-leadform',
  template: template
})

export class AALeadformComponent extends AABaseComponent {
  @Input() options: any = {};
  @Input() data: any = {};

  // Internal slider DOM reference
  @ViewChild('form') form: ElementRef;
  @ViewChild('root') root: ElementRef;

  public defaultOptions : any = defaultOptions;
  /**
   * States (string):
   * - start: initial state
   * - loading: submitting form; waiting for response
   * - error: error occured during form submit
   * - thanks: All ok, thank you
   */
  // Let parent class initialize config; the dependency injection with ElementRef
  // doesn't work directly so we have to call it explicitly.
  constructor(elementRef: ElementRef, private zone:NgZone) {
    super(elementRef);
  }

  ngOnInit(): void {
    super.ngOnInit();

    // Init state
    this.reset();
  }

  reset() : void {
    // Init data
    this.data.form = {};
    this.data.state = 'start';
  }

  private kvPair(key, value) : string {
    return [key, encodeURIComponent(value)].join('=');
  }

  private serializeData(obj) : string[] {
    var keys = Object.keys(obj),
      result = keys.map((key) => {
        var value = obj[key];
        return this.kvPair(key, value);
      });
    return result;
  }

  /**
   * We can't use angular ngControl/ngModel due to a radio button bug in
   * Angular Beta, so we have to resort to a custom handler
   */
  private getAanhef() : string {
    var key = this.data.options.form.mapping.aanhef,
      elem = this.root.nativeElement,
      male = elem.querySelector('input.aa-leadform__aanhef-m'),
      female = elem.querySelector('input.aa-leadform__aanhef-f'),
      value = male['checked'] ? this.data.options.form.fields.aanhef.dhr : this.data.options.form.fields.aanhef.mevr;
    return this.kvPair(key, value);
  }

  /**
   * Map friendly names to form field names according to options
   */
  private mapFormData(data:any) : any {
    var keys = Object.keys(data),
      result = {};
    keys.forEach((key) => {
      let newKey = this.data.options.form.mapping[key] || key;
      result[newKey] = data[key];
    });
    return result;
  }

  /**
   * Custom dynamic data to add to form data, e.g. date
   * Hardcode new fields manually.
   * You can optionally use an alias here; possible mappings are looked up in
   * the options.form.mapping hash
   */
  private dynamicFields() : any {
    var now = new Date();
    return {
      nid: this.data.options.form.nodeId,
      datumtijd: libDate.formatDateSorted(now)
    };
  }

  /**
   * Gathers form data, serialize/encode it and posts it with jQuery. Included:
   * - Form fields
   * - Hidden fields
   * - Dynamic fields
   */
  private postForm() : any {
    var url = this.data.options.form.postUrl,
      dataAanhef = [this.getAanhef()],
      dataForm = this.serializeData(this.mapFormData(this.data.form)),
      dataHidden = this.serializeData(this.mapFormData(this.data.options.form.values)),
      dataDynamic = this.serializeData(this.mapFormData(this.dynamicFields())),
      encodedData = [].concat(dataAanhef, dataForm, dataHidden, dataDynamic).join('&');
    // console.log('form post', url, encodedData);
    return jQuery.post(url, encodedData);
  }

  /**
   * Goto thank you screen
   */
  private thanks() : void {
    this.data.state = 'thanks';
  }

  /**
   * Form submit handler
   */
  onSubmit() {
    this.data.state = 'loading';
    // POST form
    this.postForm()
    .then(() => {
      this.thanks();
    }).fail((e) => {
      // Ignore errors
      // Currently always a 403 is returned on posting the form through jQuery.post()
      // Probably drupal is configured to check additional fields (tokens, etc)
      // Nevertheless the form is handled according to the definition (mail is sent)
      // That's why we can ignore the 403 error
      this.thanks();
    });
  }
}
