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
  template: template
})

export class AABlueBlockPageComponent extends AABaseComponent implements OnInit {
  @Input() options: any = {};
  @Input() data: any = {};
  @Input() showme: boolean = false;

  public defaultOptions: any = defaultOptions;
  public pensionInfo: any = this.getPensionInfo();
  
  public pageIsHidden: boolean = true;
  public hasBottomContent: boolean;
  public hasLink: boolean;
  public startPage: string = 'http://localhost:3000/template-pension-form.html';

  constructor(private thisElement: ElementRef) {
    super(thisElement);
  }

  ngOnInit() {
    super.ngOnInit();
    this.initialize();
  }

  // Reinitialize component, check pension info and set page structure again 
  public initialize() {
    if(this.isPensionInfoAvailable(this.pensionInfo)) {             
      this.setPageStructure();
      this.pageIsHidden = false;          
    
    } else { this.redirectToStartPage(); }   
  }

  // Get the pension info from session storage
  getPensionInfo(): any {
    return clientStorage.session.getItem('pensionInfo') || {};
  }

  // Check if the pension info is available
  isPensionInfoAvailable(pensionInfo: any) {
    if(Object.keys(pensionInfo).length === 0 && pensionInfo.constructor === Object) return false; 
    return true;
  }  

  // Redirect to start page (if it is not already there)
  redirectToStartPage() {
    if(this.startPage !== window.location.href) window.location.href = this.startPage;       
  }

  // Set the page structure. Used by ngClass and ngIf in view 
  setPageStructure() {        
    
    // Link    
    this.options['link.text'] && this.options['link.url'] ? this.hasLink = true: this.hasLink = false;

    // Bottom content
    this.isPensionLocationAegon(this.pensionInfo.pensionLocation) ? this.hasBottomContent = true : this.hasBottomContent = false
  }

  // Check if the pension location is from Aegon or other insurance
  isPensionLocationAegon(pensionLocation: number) {    
    return (pensionLocation == 0 || pensionLocation == 2);
  }
}