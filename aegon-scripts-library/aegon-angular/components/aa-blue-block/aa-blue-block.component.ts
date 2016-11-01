import {Component, Input, ElementRef, ViewChild, AfterViewInit, OnInit} from '@angular/core';

import 'rxjs/Rx';
import {defaultOptions} from "./defaultOptions";
import {GenericService} from "./generic.service";
import {round, roundToTenth, zeroPad} from "../../lib/format";

import {AABaseComponent} from "../../lib/classes/AABaseComponent";

const template = require('./template.html');

@Component({
  selector: 'aa-blue-block',
  template: template,
  providers: [GenericService]
})

export class AABlueBlockComponent extends AABaseComponent implements OnInit {
  @Input() options: any = {};
  @Input() data: any = {};

  // Scope variable initiation.
  // Used for tealium.
  initiated: boolean = false;
  finalized: boolean = false;
  public showError: boolean = false;
  public callingService: boolean = false;
  public  defaultOptions: any = defaultOptions;

  constructor(
    private thisElement: ElementRef,
    private genericService: GenericService
  ) {

    super(thisElement);
  }
  /*
   * Function that runs first
   */
  ngOnInit():void {
    super.ngOnInit();
    if(this.data.options.callServiceOnInit) {
      this.callService();
    }
  }

  /*
   * Initial tealium event
   *
   * @param index {number}: the index
   */
  init(index: number): void {
    this.initiated = true;
  }

  /*
   * Check if show the button
   *
   */
  showButton(): boolean {
    if(this.data.options.button.show || this.data.options.button.forceShow) {
      return true;
    }
    return false;
  }

  /*
   * Check if is a string
   *
   */
  isString(obj: any): boolean {
    return typeof obj === "string";
  }


  /*
   * Check if is a string
   *
   */
  callService(): any {
    this.showError=false;
    this.callingService=true;
    this.genericService[this.data.options.template](this.data.options.serviceUrl, this.data.options.serviceCredentials)
      .then((data) => {
        this.callingService=false;
        try {
          this.updateValues(data);
        } catch(e) {
          this.showError=true;   
        }
      })
      .catch((error) => {
        this.callingService=false;
        this.showError=true;
      })
  }

  /*
   * Update DOM values
   *
   */
  updateValues(data): any {
    let hiddenBlocks = document.querySelectorAll( "div[data-bb-template=" +  this.data.options.template + "] .hide-block-check") || [];

    for (let i = 0; i < hiddenBlocks.length; i++) {
      this.addClass(hiddenBlocks[i], 'hide-block');
    }

    for(let key in data) {
      let element = document.querySelector( "div[data-bb-template=" +  this.data.options.template + "] .aa-bb--value-reference-"+key) || null;
      let block = document.querySelector( "div[data-bb-template=" +  this.data.options.template + "] .aa-bb--inner-block-reference-"+key) || null;
      if(block!==null) this.removeClass(block, 'hide-block');
      if(element!==null) element.textContent = data[key];
    }
    if(!this.data.options.button.forceShow) {
      this.data.options.button.show = data.showButton || this.data.options.button.show;
    }
  }

  private addClass(el, className) {
    if (el.classList)
      el.classList.add(className)
    else if (!this.hasClass(el, className)) el.className += " " + className
  }

  private removeClass(el, className) {
    if (el.classList)
      el.classList.remove(className)
    else if (this.hasClass(el, className)) {
      var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
      el.className=el.className.replace(reg, ' ')
    }
  }

  private hasClass(el, className) {
    if (el.classList)
      return el.classList.contains(className)
    else
      return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
  }

}
