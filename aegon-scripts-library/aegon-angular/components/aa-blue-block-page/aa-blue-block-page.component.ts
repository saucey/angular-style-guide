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

  public defaultOptions: any = defaultOptions;
  public pensionInfo: any = {};
  
  public pageIsHidden: boolean = true;
  public hasBottomContent: boolean;
  public hasLink: boolean;

  constructor(private thisElement: ElementRef) {
    super(thisElement);
  }

  ngOnInit() {
    super.ngOnInit();
    this.initialize();
  }

  // Get and check pension info, set page structure and call service from blue block component
  public initialize() {
    this.pensionInfo = this.getPensionInfo();

    if(this.isPensionInfoAvailable(this.pensionInfo)) {    
      this.setPageStructure();
      this.showPage();
          
    } else { if(this.options['start.redirect'] == true) this.redirectToStartPage(); }   
  }

  hidePage() {
    this.pageIsHidden = true;
  }

  showPage() {
    this.pageIsHidden = false;
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
    if(this.options['start.url'] !== window.location.href) window.location.href = this.options['start.url'];       
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