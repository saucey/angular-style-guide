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
  public columnLeftIsHidden: boolean = false;
  public columnRightIsHidden: boolean = false;
  
  public hasTopContent: boolean = true;
  public hasLink: boolean = true;
  public hasBottomContent: boolean = true;  

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
      this.setPageStructure(this.options.page);
      this.showPage();
          
    } else { if(this.data.options.start.redirect == true) this.redirectToStartPage(); }   
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
    if(this.data.options.start.url !== window.location.href) window.location.href = this.data.options.start.url;       
  }

  // Check if the pension location is from Aegon or other insurance
  isPensionLocationAegon(pensionLocation: number) {    
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
  setPageStructure(page: string) { 

    if(page === 'pensionForm') { 
      this.hasLink = false;
      this.hasBottomContent = false;
    }

    if(page === 'dip') { 
      this.hasTopContent = false;
      this.isPensionLocationAegon(this.pensionInfo.pensionLocation) && !this.isStartingDateWithin3Months(this.pensionInfo.startingDate) ? 
        this.hasBottomContent = true : this.hasBottomContent = false;
    }

    if(page === 'vpu') { 
      this.hasTopContent = false;
      !this.isStartingDateWithin3Months(this.pensionInfo.startingDate) ? this.hasBottomContent = true : this.hasBottomContent = false;
      !this.pensionInfo.insurablePartner ? this.columnRightIsHidden = true : this.columnRightIsHidden = false;
    } 
  }
}