/**
 * A lead generation form that accepts user details
 * Form is posted to a configured backend form in Drupal (through FormAssembly)
 * To make this work, first configure the form in FormAssembly, then in Drupal
 * Enter the form details in the options file.
 */

import {Component, Input, Output, NgZone, ElementRef, ViewChild} from 'angular2/core';
import {template} from "./template";
import {AABaseComponent} from '../../lib/classes/AABaseComponent';
import {defaultOptions} from "./defaultOptions";
import * as libDom from "../../lib/dom";
import * as libUtil from "../../lib/util";

declare var jQuery: any;

@Component({
  selector: 'aa-leadform',
  template: template
})

export class AALeadformComponent extends AABaseComponent {
  @Input() options: any = {};
  @Input() data: any = {};
  @Input() visible: boolean = false;

  // Internal slider DOM reference
  @ViewChild('form') form: ElementRef;

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
    // Initial state
    this.data.state = this.data.state || 'start';

    // Init data
    this.data.form = {};

    // Demo mode?
    if (this.data.options.demo) {
      setInterval(() => {
        this.data.state = this.data.state === 'start' ? 'loading' : this.data.state === 'loading' ? 'thanks' : 'start';
      }, this.data.options.demo);
    }
  }

  private kvPair(key, value) : string {
    return [key, encodeURIComponent(value)].join('=');
  }

  private serializeData(obj) : string[] {
    console.log('serializeData', obj);
    var keys = Object.keys(obj),
      result = keys.map((key) => {
        var value = obj[key];
        console.log('processing', key, value);
        if (value && value.call) {
          console.log('function type', key, value);
          value = value(this);
        }
        return this.kvPair(key, value);
      });
    return result;
  }

  /**
   * We can't use angular ngControl/ngModel due to a radio button bug in
   * Angular Beta, so we have to resort to a custom handler
   */
  private getAanhef() : string {
    var key = this.data.options.fields.aanhef.name,
      male = document.getElementById('aanhefM'),
      female = document.getElementById('aanhefM'),
      value = male['checked'] ? this.data.options.fields.aanhef.dhr : this.data.options.fields.aanhef.mevr;
    return this.kvPair(key, value);
  }

  private postForm() : any {
    var url = this.data.options.postUrl,
      dataAanhef = [this.getAanhef()],
      dataForm = this.serializeData(this.data.form),
      dataHidden = this.serializeData(this.data.options.hiddenFields),
      encodedData = [].concat(dataAanhef, dataForm, dataHidden).join('&');
    console.log('encodedData', dataAanhef, dataForm, dataHidden, encodedData);
    return jQuery.post(url, encodedData);
  }

  private thanks() : void {
    this.data.state = 'thanks';
  }

  onSubmit() {
    this.data.state = 'loading';
    // POST form
    // this.postForm()
    // .then(() => {
    //   this.thanks();
    // }).error(() => {
    //   this.thanks();
    // });
    // return;

    // GOTO thanks
    setTimeout(() => {
      this.thanks();
    }, 3000);
  }

}
