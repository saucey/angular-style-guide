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
  selector: 'aa-pension-offer-form',
  template: template
})

export class AAPensionOfferFormComponent extends AABaseComponent implements OnInit {
  @Input() data: any = {};
  @Input() options: any = {};

  public defaultOptions: any = defaultOptions;
  public pensionInfo: Object;
  public pensionProduct: Object;
  public form_started:boolean = false;

  constructor(private thisElement: ElementRef) {
    super(thisElement);
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

    if(this.getProductTipe()=="Uitkerend Beleggingspensioen") {
      this.sendTealiumTagging('offerte_aanvraag_uitkerend_beleggingspensioen', 'variabele_pensioenuitkering', 'variabele_pensioenuitkering', 0, 'offerte_aanvraag_uitkerend_beleggingspensioen', 'form_view');
    } else {
      this.sendTealiumTagging('offerte_aanvraag_direct_ingaand_pensioen', 'direct_ingaand_pensioen', 'direct_ingaand_pensioen', 0, 'offerte_aanvraag_direct_ingaand_pensioen', 'form_view');   
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

  private getProductTipe() {
    let template: string = this.pensionProduct["template"] || "";
    return (template=="vpuFixed" || template=="vpuVariable") ? "Uitkerend Beleggingspensioen" : "Uitkerend Garantiepensioen";
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

  fireTealiumFormStarted() {
    if(this.form_started)
       return;

    if(this.getProductTipe()=="Uitkerend Beleggingspensioen") {
      this.sendTealiumTagging('offerte_aanvraag_uitkerend_beleggingspensioen', 'variabele_pensioenuitkering', 'variabele_pensioenuitkering', 1, 'offerte_aanvraag_uitkerend_beleggingspensioen', 'form_started');
    } else {
      this.sendTealiumTagging('offerte_aanvraag_direct_ingaand_pensioen', 'direct_ingaand_pensioen', 'direct_ingaand_pensioen', 1, 'offerte_aanvraag_direct_ingaand_pensioen', 'form_started');   
    }

    this.form_started = true;
   }
}