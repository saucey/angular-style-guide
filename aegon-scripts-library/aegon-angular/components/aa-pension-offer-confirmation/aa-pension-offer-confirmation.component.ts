/**
 * Page component
 */

// Imports
import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {AABaseComponent} from '../../lib/classes/AABaseComponent';
import {defaultOptions} from './defaultOptions';


// Constants
const template = require('./template.html');

@Component({
  selector: 'aa-pension-offer-confirmation',
  template: template
})

export class AAPensionOfferConfirmationComponent extends AABaseComponent implements OnInit {
  @Input() data: any = {};
  @Input() options: any = {};

  public defaultOptions: any = defaultOptions;
  public pensionInfo: Object;
  public pensionProduct: Object;

  constructor(private thisElement: ElementRef) {
    super(thisElement);
    console.log('This is a copy of pension offer form. But it dont show anything on screen');
  }

  public ngOnInit() {
    super.ngOnInit();
    this.initialize();
  }

  // Get and check pension data, set page structure and call service from blue block component
  private initialize():void {
    this.pensionInfo = this.getSessionStorage('pensionInfo');
    this.pensionProduct = this.getSessionStorage('pensionProduct');

    if(this.isObjectAvailable(this.pensionInfo) && this.isObjectAvailable(this.pensionProduct)) {    
      // Do some magic
      console.dir(this.pensionProduct['values'][0]);
          
    } else { 
      console.log('Go redirect!');
      if(this.data.options.start.redirect == true) this.redirectToStartPage(); 
    }   
  }

  // Get the session storage from an existing object or an empty object 
  private getSessionStorage(objectKey: string): Object {
    return clientStorage.session.getItem(objectKey) || {};
  }

  // Check if data is a string (used in template)
  public isString(data: any): boolean {
    return typeof data === 'string';
  }    

  // Check if input is an object and has at least one key
  private isObjectAvailable(object: Object): boolean {
    let result = false;

    if(object.constructor === Object && Object.keys(object).length > 0) result = true;       
    
    return result;
  }  

  // Redirect to start page
  private redirectToStartPage():void {
     window.location.href = this.data.options.start.url;       
  }
}