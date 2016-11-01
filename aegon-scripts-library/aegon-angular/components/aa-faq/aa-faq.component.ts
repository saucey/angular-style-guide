import {Component, Input} from '@angular/core';

const template = require('./template.html');

@Component({
  selector: 'aa-faq',
  template: template
})

export class AAFAQComponent {

  @Input() title: string = '';
  @Input() data : any[];
}

