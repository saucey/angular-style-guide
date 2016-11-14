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
  selector: 'aa-pension-offer-form',
  template: template
})

export class AAPensionOfferFormComponent extends AABaseComponent implements OnInit {
  @Input() data: any = {};
  @Input() options: any = {};

  public defaultOptions: any = defaultOptions;
  public pensionInfo: Object;
  public pensionProduct: Object;

  constructor(private thisElement: ElementRef) {
    super(thisElement);
  }

  public ngOnInit() {
    super.ngOnInit();
    this.initialize();
  }

  // Get and check pension info, set page structure and call service from blue block component
  private initialize() {
    this.pensionInfo = this.getSessionStorage('pensionInfo');
    this.pensionProduct = this.getSessionStorage('pensionProduct');

    if(this.isObjectAvailable(this.pensionInfo) && this.isObjectAvailable(this.pensionProduct)) {    
      // Do some magic
          
    } else { 
      console.log('Go redirect!');
      if(this.data.options.start.redirect == true) this.redirectToStartPage(); 
    }   
  }

  // Get the session storage from an existing object or an empty object 
  private getSessionStorage(objectKey: string): Object {
    return clientStorage.session.getItem(objectKey) || {};
  }

  // Check if object is available and contains some data
  private isObjectAvailable(object: Object) {
    let result = false;

    if(Object.keys(object).length > 0 && object.constructor === Object) result = true; 
    
    return result;
  }  

  // Redirect to start page
  private redirectToStartPage() {
     window.location.href = this.data.options.start.url;       
  }
}