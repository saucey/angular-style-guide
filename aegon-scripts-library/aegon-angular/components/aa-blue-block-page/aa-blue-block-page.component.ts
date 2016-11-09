/**
 * Page component
 */

// Imports
import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {AABaseComponent} from '../../lib/classes/AABaseComponent';
import {defaultOptions} from './defaultOptions';

import {aegonTealium} from '../../lib/aegon_tealium';

// Constants
const template = require('./template.html');

@Component({
  selector: 'aa-blue-block-page',
  template: template
})

export class AABlueBlockPageComponent extends AABaseComponent implements OnInit {
  @Input() options: any = {};
  @Input() data: any = {};

  public defaultOptions: any = defaultOptions;
  public pensionInfo: any = {};
  public bottomContent: any = {};
  public leftContent: any = {};
  public rightContent: any = {};
  
  public pageIsHidden: boolean = true;
  public columnLeftIsHidden: boolean = false;
  public columnRightIsHidden: boolean = false;
  
  public hasTopContent: boolean = true;
  public hasLink: boolean = true;
  public hasBottomContent: boolean = true;  

  constructor(private thisElement: ElementRef) {
    super(thisElement);
  }

  public ngOnInit() {
    super.ngOnInit();
    this.initialize();
  }

  // Get and check pension info, set page structure and call service from blue block component
  public initialize() {
    this.pensionInfo = this.getPensionInfo();

    if(this.isPensionInfoAvailable(this.pensionInfo)) {    
      this.setPageStructure(this.options.page);
      this.showPage();
          
    } else { if(this.data.options.start.redirect == true) this.redirectToStartPage(); }   
  }

  private hidePage() {
    this.pageIsHidden = true;
  }

  private showPage() {
    this.pageIsHidden = false;
  }  

  // Get the pension info from session storage
  public getPensionInfo(): any {
    return clientStorage.session.getItem('pensionInfo') || {};
  }

  // Check if the pension info is available
  public isPensionInfoAvailable(pensionInfo: any) {
    if(Object.keys(pensionInfo).length === 0 && pensionInfo.constructor === Object) return false; 
    return true;
  }  

  // Redirect to start page (if it is not already there)
  private redirectToStartPage() {
    if(this.data.options.start.url !== window.location.href) window.location.href = this.data.options.start.url;       
  }

  // Check if the pension location is from Aegon or other insurance
  public isPensionLocationAegon(pensionLocation: number) {    
    return (pensionLocation == 0 || pensionLocation == 2);
  }  

	isStartingDateWithin3Months(date: string) {
		let currentDate = new Date();
		let startingDate = new Date(date);
		let startingDateMonth = (currentDate.getFullYear() == startingDate.getFullYear()) ? 
      startingDate.getMonth() : startingDate.getMonth() + 12;
      
		return (startingDateMonth - currentDate.getMonth()) <= 3;
	}

  // Set the page structure. Used by ngClass and ngIf in view 
  private setPageStructure(page: string) { 

    // Pension form page
    if(page === 'pensionForm') { 
      this.hasLink = false;
      this.hasBottomContent = false;
    }

    // DIP page
    if(page === 'dip') { 
      this.hasTopContent = false;
      
      // Pension location is Aegon
      if(this.isPensionLocationAegon(this.pensionInfo.pensionLocation)) {
        this.bottomContent = this.data.options.bottom;
        this.sendTealiumTagging('direct_ingaand_pensioen_aegon', 'direct_ingaand_pensioen_aegon', 'direct_ingaand_pensioen_aegon');
      
      // Pension location is not Aegon
      } else {
        this.isStartingDateWithin3Months(this.pensionInfo.startingDate) ? 
          this.hasBottomContent = false : 
          this.bottomContent = this.data.options.bottomVariant;
        
        this.sendTealiumTagging('direct_ingaand_pensioen', 'direct_ingaand_pensioen', 'direct_ingaand_pensioen');                 
      }

      // With partner
      if(this.pensionInfo.insurablePartner) {
        this.leftContent = this.data.options.left;
        this.rightContent = this.data.options.right; 

      // Without partner  
      } else {
        this.leftContent = this.data.options.leftVariant
        this.rightContent = this.data.options.rightVariant
      } 
    }

    // UBP page
    if(page === 'ubp') {       
      this.hasTopContent = false;
      this.bottomContent = this.data.options.bottom;

      // With partner
      if(this.pensionInfo.insurablePartner) {
        this.leftContent = this.data.options.left;
        this.rightContent = this.data.options.right;
        this.columnRightIsHidden = false;

      // Without partner  
      } else {
        this.leftContent = this.data.options.leftVariant
        this.columnRightIsHidden = true;
      }       
      
      // Starting date
      this.isStartingDateWithin3Months(this.pensionInfo.startingDate) ? 
        this.hasBottomContent = false : 
        this.hasBottomContent = true;
        
      // Pension location
      this.isPensionLocationAegon(this.pensionInfo.pensionLocation) ? 
        this.sendTealiumTagging('uitkerend_beleggingspensioen', 'variabele_pensioenuitkering_aegon', 'variabele_pensioenuitkering_aegon') :
        this.sendTealiumTagging('uitkerend_beleggingspensioen', 'variabele_pensioenuitkering', 'variabele_pensioenuitkering');
    } 
  }

  private sendTealiumTagging(_page_cat_2_name: string, _page_cat_5_product: string, _product_name: string) {
    let tealiumObj: any = {
      page_cat_1_type: 'product',
      page_cat_2_name: _page_cat_2_name,
      page_cat_3_section: 'particulier',
      page_cat_4_productgroup: 'pensioen',
      page_cat_5_product: _page_cat_5_product,
      product_name: [_product_name],
      product_category: ['pensioen'],
      event: 'prodview'
    }

    aegonTealium(tealiumObj);  
  }
}