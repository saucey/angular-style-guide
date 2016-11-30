/**
 * Contact sticky component
 */

// Imports
import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {AABaseComponent} from '../../lib/classes/AABaseComponent';
import {defaultOptions} from './defaultOptions';


// Constants
const template = require('./template.html');

@Component({
  selector: 'aa-contact-sticky',
  template: template
})

export class AAContactSticky extends AABaseComponent implements OnInit {
  // @Input() data: any = {};
  // @Input() options: any = {};

  public defaultOptions: any = defaultOptions;
  public title: string  = defaultOptions.title;
  public freetext: string  = defaultOptions.freeText;
  public hourstext: string  = defaultOptions.hours.text;
  public telephone: string  = defaultOptions.phoneNumber;
  public startchatlabel: string  = defaultOptions.startChatLabel;
  public dateFrom: string;
  public dateTo: string;

  constructor(private thisElement: ElementRef) {
    super(thisElement);
  }

  public ngOnInit() {
    super.ngOnInit();
    this.initialize();
    // console.log(defaultOptions, 'the options');
    let today: any = new Date();
    today = today.getDay();
    var hour = defaultOptions.hours.days[today];
    this.dateFrom = hour.from;
    this.dateTo = hour.to;
  }

  private initialize():void {

  }
}
