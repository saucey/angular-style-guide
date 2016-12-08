/**
 * Form builder component
 */

// Imports
import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {AABaseComponent} from '../../lib/classes/AABaseComponent';
import {defaultOptions} from './defaultOptions';
import {aegonTealium} from "../../lib/aegon_tealium";


// Constants
const template = require('./template.html');

@Component({
  selector: 'aa-form-builder',
  template: template
})

export class AAFormBuilderComponent extends AABaseComponent implements OnInit {
  @Input() data: any = {};
  @Input() options: any = {};

  public defaultOptions: any = defaultOptions;
  public form_started:boolean = false;
  public formData: Object = {};
  public showError: boolean = false;
  public callingService: boolean = false;

  constructor(private thisElement: ElementRef) {
    super(thisElement);
  }

  public ngOnInit() {
    super.ngOnInit();
    this.initialize();
  }

  // Get and check pension data, set page structure and call service from blue block component
  public initialize():void {
  
  }

  public getDataFromStorage(storage: string, object: string, key: string): any {
    console.log(storage, object, key);
    var item: any = "";
    try {
      item = clientStorage[storage].getItem(object)[key];
    } catch(err) {
      console.log("Can't get data from storage: ", err);
    }
    return item;
  }

  save(model: any, isValid: boolean) {
      if(!this.isValid())
        return false;

      this.callService();
      //location.href = this.data.options.form.redirectUrl;
      return false;
  }

  isValid(): boolean {
    return true;
  }

  callService(): any {
    this.showError=false;
    this.callingService=true;
    /*
    this.genericService(this.data.options.serviceUrl, this.data.options.serviceCredentials)
      .then((data) => {
        this.callingService=false;
        try {
          this.serviceCallBack(data);
        } catch(e) {
          this.showError=true;   
        }
      })
      .catch((error) => {
        this.callingService=false;
        this.showError=true;
      })
      */
  }

  serviceCallBack(data) {
    // callback code here
  }
}