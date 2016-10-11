import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';

import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

import * as aaComp from './components';
import * as aaPipes from './pipes';
import { AAElementDirective } from './directives/aa-element/aa-element.directive.ts'
import * as comp from '../components/angular-components';

import {QuickQuoteBoeterenteComponent} from '../components/quickquote-boeterente/quickquote-boeterente.component';
import {QuickQuoteAovComponent} from '../components/quickquote-aov/quickquote-aov.component';
import {QuickQuoteDipComponent} from '../components/quickquote-dip/quickquote-dip.component';
import {QuickQuoteMortgageComponent} from '../components/quickquote-mortgage/quickquote-mortgage.component';

const internalDeclarations = [
  AAElementDirective,
  aaComp.AAHintComponent,
  aaComp.AASliderComponent,
  aaComp.AASliderInputComponent,
  aaComp.AAInputRadioComponent,
  aaComp.AAInputDropDownComponent,
  aaComp.AAInputDateComponent,
  aaComp.AAInputNumberComponent,
  aaComp.AAHighchartComponent,
  aaComp.AAStickyComponent,


  aaPipes.AAMoneyPipe,
  aaPipes.AAPeriodPipe,
  aaPipes.AAReplacePipe,
  aaPipes.AAReverseDateStringPipe,

  comp.HelpComponent,
  comp.InputNumberComponent,
  comp.InputNumberValueAccessor,
  comp.InputDateComponent,
  comp.InputDateValueAccessor,
  comp.InputRadioComponent,
  comp.SliderComponent,
  comp.SliderValueAccessor,
  comp.CheckboxComponent,
  comp.CheckboxValueAccessor,
  comp.InputRadioValueAccessor
];

const exportedDeclarations = [

  QuickQuoteBoeterenteComponent,
  QuickQuoteAovComponent,
  QuickQuoteMortgageComponent,
  QuickQuoteDipComponent,

  aaComp.AADataComponent,
  aaComp.AACssComponent,

  aaComp.AAQQAovComponent,
  aaComp.AAQQBeleggenComponent,
  aaComp.AAQQBoeterenteComponent,
  aaComp.AAQQHistorischRendementComponent,
  aaComp.AAQQSummaryComponent,
  aaComp.AAWiaContentComponent,
  aaComp.AAQQMortgageComponent,
  aaComp.AAPensionFormComponent,
  aaComp.AALeadformComponent,
  aaComp.AAQuizComponent,
  aaComp.AAEditableValueComponent
];

@NgModule({
  imports:      [
      BrowserModule,
      FormsModule,
      HttpModule,
      JsonpModule,
      ReactiveFormsModule
  ],
  declarations: [
    ...internalDeclarations,
    ...exportedDeclarations
  ],
  exports: exportedDeclarations,
  bootstrap:    []
})
export class AppComponentModule { }
