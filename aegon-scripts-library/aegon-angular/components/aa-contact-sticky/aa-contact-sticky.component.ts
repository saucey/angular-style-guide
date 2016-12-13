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
  @Input() data: any = {};
  @Input() options: any = {};

  public defaultOptions: any = defaultOptions;
  public title: string  = defaultOptions.title;
  public text: string  = defaultOptions.text;
  public hoursText: string  = defaultOptions.hours.availabeText;
  public fromHours: string = '';
  public toHours: string = '';

  constructor(private thisElement: ElementRef) {
    super(thisElement);
  }

  public ngOnInit() {
    super.ngOnInit();
    this.getHoursTextForToday();
  } 
    

  private getHoursTextForToday():void {
    let today: any = new Date().getDay();

    if(defaultOptions.hours.days[today]) {
      this.fromHours = defaultOptions.hours.days[today]['from'];
      this.toHours = defaultOptions.hours.days[today]['to'];
    
    } else { this.hoursText = defaultOptions.hours.notAvailabeText; }
  }
}
