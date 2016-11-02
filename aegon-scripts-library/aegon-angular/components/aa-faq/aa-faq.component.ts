import { Component, Input } from '@angular/core';

const template = require('./template.html');

interface FAQItem {
  question: string,
  answer: string,
  feedbackTitle:string,
  feedbackContent:string
}

@Component({
  selector: 'aa-faq',
  template: template
})
export class AAFAQComponent {

  @Input() title: string = '';
  @Input() data : FAQItem[];
}