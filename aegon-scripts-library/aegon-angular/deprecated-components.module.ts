import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';

import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

import * as comp from '../components/angular-components';

import { QuickQuoteBoeterenteComponent } from '../components/quickquote-boeterente/quickquote-boeterente.component';
import { QuickQuoteAovComponent } from '../components/quickquote-aov/quickquote-aov.component';
import { QuickQuoteDipComponent } from '../components/quickquote-dip/quickquote-dip.component';
import { QuickQuoteMortgageComponent } from '../components/quickquote-mortgage/quickquote-mortgage.component';

const declarations = [

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
    comp.InputRadioValueAccessor,
    comp.MoneyPipe,

    QuickQuoteBoeterenteComponent,
    QuickQuoteAovComponent,
    QuickQuoteMortgageComponent,
    QuickQuoteDipComponent,
];

//Exports
export const DeprecatedComponentsModuleExports = declarations;

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        JsonpModule,
        ReactiveFormsModule
    ],
    declarations: declarations,
    exports: declarations,
    bootstrap: []
})
export class DeprecatedComponentsModule {
}
