import {Component, OnInit} from 'angular2/core';
import {HelpComponent} from './help.component'
import {InputMoneyComponent, InputMoneyValueAccessor} from './input-money.component';
import {InputDateComponent, InputDateValueAccessor} from './input-date.component';
import {CheckboxComponent, CheckboxValueAccessor} from './checkbox.component';

const monthLabels: string[] = [
  'januari', 'februari', 'maart', 'april', 'mei', 'juni',
  'juli', 'augustus', 'september', 'oktober', 'november', 'december'
];

@Component({
  selector: 'aegon-quickquote-dip',
  directives: [
    HelpComponent, InputMoneyComponent, InputMoneyValueAccessor, InputDateComponent, InputDateValueAccessor,
    CheckboxComponent, CheckboxValueAccessor
  ],
  template: (<HTMLTextAreaElement>document.querySelector('#quickQuoteDipTemplate')).value
})
export class QuickQuoteDipComponent implements OnInit {
  step: number = 1;
  pensionAmount: number = 25000;
  amountTooSmall: boolean;
  storedInAegon: boolean;
  storedElsewhere: boolean;
  birthDate: string;
  deathBenefit: boolean;
  partnerBirthDate: string;
  startingDate: string;
  startingDateChoices: any[] = [];

  ngOnInit() {
    let date: Date = new Date(),
      year: number = date.getFullYear(),
      month: number = date.getMonth() + 1;
    for (let i: number = 0; i < 12; i++) {
      if (month === 12) {
        month = 1;
        year += 1;
      } else {
        month += 1;
      }
      let value = year + '-' + (month < 10 ? '0': '') + month + '-01',
        label = '1 ' + monthLabels[month - 1] + ' ' + year;
      this.startingDateChoices.push({value: value, label: label});
    }
  }

  isValidAmount(): boolean {
    this.amountTooSmall = this.pensionAmount < 25000;
    return !this.amountTooSmall;
  }

  submitAmount(): void {
    if (this.isValidAmount()) {
      this.step += 1;
    }
  }

  readyForSubmit(): boolean {
    //TODO: validate form and display any error messages.
    return false;
  }

  submit(): void {
    //TODO: call service and process result.
  }
}
