/**
 * Form builder component
 */

// Imports
import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {AABaseComponent} from '../../lib/classes/AABaseComponent';
import {defaultOptions} from './defaultOptions';
import {aegonTealium} from "../../lib/aegon_tealium";
import {FormBuilderService} from "./form-builder.service";


// Constants
const template = require('./template.html');

@Component({
  selector: 'aa-form-builder',
  template: template,
  providers: [FormBuilderService]
})

export class AAFormBuilderComponent extends AABaseComponent implements OnInit {
  @Input() data: any = {};
  @Input() options: any = {};

  public defaultOptions: any = defaultOptions;
  public form_started:boolean = false;
  public formData: Object = {};
  public showError: boolean = false;
  public callingService: boolean = false;
  public showThankYouMessage: boolean = false;

  constructor(
    private thisElement: ElementRef,
    private formBuilderService: FormBuilderService) {
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
    var item: any = "";
    try {
      item = clientStorage[storage].getItem(object)[key];
    } catch(err) {
      console.log("Can't get data from storage: ", err);
    }
    return item;
  }

  // Check if data is a string (used in template)
  public isString(data: any): boolean {
    return typeof data === 'string';
  } 

  save(model: any, isValid: boolean) {
      if(!this.isValid())
        return false;
      try {
        let timestamp = new Date().getTime();
        this.formBuilderService.assign(this.data.options.serviceRequest, this.data.options.correlationIdPath, this.data.options.correlationIdPrefix+timestamp);
      } catch(err) {
        console.log(err);
      }
      this.callService(model);
      return false;
  }

  isValid(): boolean {
    return true;
  }

  callService(model): any {
    this.showError=false;
    this.callingService=true;

    this.formBuilderService.call(this.data.options.submitButton.serviceUrl, this.data.options.serviceCredentials, model, this.data.options.serviceRequest)
      .then((data) => {
        this.callingService=false;
        try {
          let serviceOkPath = this.formBuilderService.getPropByPath(data, this.data.options.serviceOkPath, null);
          if(this.data.options.serviceOkCheckOnlyIfExists) {
            if(serviceOkPath==null) {
              this.showError=true; 
              return false;  
            }
          } else if(serviceOkPath!=this.data.options.serviceOkValue) {
            this.showError=true; 
            return false;
          }
          this.serviceCallBack(data);
          if(this.data.options.thankYouMessage) {
            this.showThankYouMessage = true;
          }
          if(this.data.options.redirectUrl) {
            location.href = this.data.options.form.redirectUrl;
          }
        } catch(e) {
          this.showError=true;   
        }
      })
      .catch((error) => {
        this.callingService=false;
        this.showError=true;
      })
  }

  serviceCallBack(data) {
    // callback code here
  }
}