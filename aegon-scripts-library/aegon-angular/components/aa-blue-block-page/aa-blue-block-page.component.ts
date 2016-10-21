/**
 * Page component
 */

// Imports
import {Component, ElementRef, Input, OnInit} from "@angular/core";
import {AABaseComponent} from "../../lib/classes/AABaseComponent";
import {defaultOptions} from "./defaultOptions";

// Constants
const template = require('./template.html');

@Component({
  selector: 'aa-blue-block-page',
  template: template,
})

export class AABlueBlockPageComponent extends AABaseComponent implements OnInit {
  @Input() options: any = {};
  @Input() data: any = {};

  public defaultOptions: any = defaultOptions;
  public pensionInfo: any = this.getPensionInfo();
  
  public pageIsHidden: boolean;
  public hasBottomContent: boolean;
  public hasLink: boolean;
  public startPage: string = 'http://www.aegon.nl';

  constructor(private thisElement: ElementRef) {
    super(thisElement);
  }

  ngOnInit() {
    super.ngOnInit();
    if(!this.isPensionInfoComplete()) this.redirectToStartPage();
    this.setPageStructure(this.options.hidden);  
  }

  // Reinitialize component, check pension info and set page structure again 
  reinitialize() {
    if(!this.isPensionInfoComplete()) this.redirectToStartPage();
    this.setPageStructure();    
  }

  // Get the pension info from session storage
  getPensionInfo() {
    return clientStorage.session.getItem('pensionInfo') || {};
  }

  // Check if the pension info is complete and types are right
  isPensionInfoComplete() {
    if(Object.keys(this.pensionInfo).length === 0 && this.pensionInfo.constructor === Object) return false;
    if(typeof(this.pensionInfo.pensionAmount) !== 'number') return false;
    if(typeof(this.pensionInfo.pensionLocation) !== 'number') return false;
    if(typeof(this.pensionInfo.hasPartner) !== 'boolean') return false;
    if(typeof(this.pensionInfo.insurablePartner) !== 'boolean') return false;
    if(typeof(this.pensionInfo.birthDate) !== 'string') return false;
    if(typeof(this.pensionInfo.birthDateOfPartner) !== 'string') return false;
    if(typeof(this.pensionInfo.startingDate) !== 'string') return false;  
    return true;
  }

  // Redirect to another page
  redirectToStartPage() {
    console.log('Redirect to start page');
    // window.location.href = this.startPage;
  }

  // Set the page structure. Used by ngClass and ngIf in view 
  setPageStructure(hidePage: boolean = false) {        
    hidePage ? this.pageIsHidden = true : this.pageIsHidden = false;
    this.isPensionLocationAegon() ? this.hasBottomContent = true : this.hasBottomContent = false
    this.options['link.text'] && this.options['link.url'] ? this.hasLink = true: this.hasLink = false;
  }

  // Check if the pension location is from Aegon or other insurance
  isPensionLocationAegon() {
    return (this.pensionInfo.pensionLocation === 0 || this.pensionInfo.pensionLocation === 2);
  }
}