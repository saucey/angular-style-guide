/**
 * Page component
 */

// Imports
import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {AABaseComponent} from '../../lib/classes/AABaseComponent';
import {defaultOptions} from './defaultOptions';
import {aegonTealium} from "../../lib/aegon_tealium";


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
  }

  public ngOnInit() {
    super.ngOnInit();
    this.initialize();
  }

  // Get and check pension data
  private initialize():void {
    this.pensionInfo = this.getSessionStorage('pensionInfo');
    this.pensionProduct = this.getSessionStorage('pensionProduct');

    if(this.isObjectAvailable(this.pensionInfo) && this.isObjectAvailable(this.pensionProduct)) {    
      
      // If session storage is available it can be removed because 
      // the visitor is at the end of the process
      if(this.data.options.cleanSessionStorage.length) {
        this.cleanSessionStorage(this.data.options.cleanSessionStorage);
      }          
      
    } else {       
      if(this.data.options.start.redirect == true) this.redirectToStartPage(); 
    }

    if(this.getProductType()=="Uitkerend Beleggingspensioen") {
      this.sendTealiumTagging('offerte_aanvraag_uitkerend_beleggingspensioen', 'variabele_pensioenuitkering', 'variabele_pensioenuitkering', 2, 'offerte_aanvraag_uitkerend_beleggingspensioen', 'form_completed');
    } else {
      this.sendTealiumTagging('offerte_aanvraag_direct_ingaand_pensioen', 'direct_ingaand_pensioen', 'direct_ingaand_pensioen', 2, 'offerte_aanvraag_direct_ingaand_pensioen', 'form_completed');   
    }
  }

  // Get the session storage from an existing object or an empty object 
  public getSessionStorage(objectKey: string): Object {
    return clientStorage.session.getItem(objectKey) || {};
  }

  // Check if data is a string (used in template)
  public isString(data: any): boolean {
    return typeof data === 'string';
  }    

  // Check if input is an object and has at least one key
  public isObjectAvailable(object: Object): boolean {
    let result = false;

    if(object.constructor === Object && Object.keys(object).length > 0) result = true;       
    
    return result;
  }  

  // Redirect to start page
  private redirectToStartPage():void {
     window.location.href = this.data.options.start.url;       
  }

  // Clean 
  private cleanSessionStorage(items: any):void {
    try {
      items.forEach(function(key) {
        clientStorage.session.removeItem(key);
      });
    } catch(err) {
      console.info("Cannot clean storage!");
    }
  }

  private sendTealiumTagging(_page_cat_2_name: string, _page_cat_5_product: string, _product_name: string, _page_step: number, _form_name: string, _event: string) {
    let tealiumObj: any = {
      page_cat_1_type: 'formulier',
      page_cat_2_name: _page_cat_2_name,
      page_cat_3_section: 'particulier',
      page_cat_4_productgroup: 'pensioen',
      page_cat_5_product: _page_cat_5_product,
      page_step: _page_step,
      form_name: _page_step,
      product_name: [_product_name],
      product_category: ['pensioen'],
      event: _event
    };
    console.log('Tealium tagging: ', tealiumObj);
    aegonTealium(tealiumObj);  
  }

  private getProductType() {
    let template: string = this.pensionProduct["template"] || "";
    return (template=="vpuFixed" || template=="vpuVariable") ? "Uitkerend Beleggingspensioen" : "Uitkerend Garantiepensioen";
  }
}