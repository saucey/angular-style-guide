import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

import { DeprecatedComponentsModule } from './deprecated-components.module'

import * as aaComp from './components';
import * as aaPipes from './pipes';
import { AAElementDirective } from './directives/aa-element/aa-element.directive.ts';

const declarations = [
    AAElementDirective,
    aaComp.AABlueBlockPageComponent,
    aaComp.AAHintComponent,
    aaComp.AASliderComponent,
    aaComp.AASliderInputComponent,
    aaComp.AAInputRadioComponent,
    aaComp.AAInputSwitchComponent,
    aaComp.AAInputDropDownComponent,
    aaComp.AAInputDateComponent,
    aaComp.AAInputNumberComponent,
    aaComp.AAHighchartComponent,
    aaComp.AATabsViewComponent,
    aaComp.AATabsViewItemComponent,
    aaComp.AAStickyComponent,
    aaComp.AAModalComponent,
    aaComp.AACollapsibleTopicComponent,

    aaPipes.AAMoneyPipe,
    aaPipes.AAPeriodPipe,
    aaPipes.AAReplacePipe,
    aaPipes.AAReverseDateStringPipe,
    aaPipes.DateToReadableString,

    aaComp.AADataComponent,
    aaComp.AACssComponent,

    aaComp.AAQQAovComponent,
    aaComp.AAQQBeleggenComponent,
    aaComp.AAQQBoeterenteComponent,
    aaComp.AAQQHistorischRendementComponent,
    aaComp.AAQQSummaryComponent,
    aaComp.AAQQMortgageComponent,
    aaComp.AAPensionFormComponent,
    aaComp.AALeadformComponent,
    aaComp.AAQuizComponent,
    aaComp.AAEditableValueComponent,
    aaComp.AABlueBlockComponent,
    aaComp.AATodosComponent,
    aaComp.AALoaderComponent,
    aaComp.AAFAQComponent,
    aaComp.AAPensionOfferFormComponent
];

//Exports
export const AAComponentsExports = declarations;

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        JsonpModule,
        ReactiveFormsModule,
        DeprecatedComponentsModule
    ],
    declarations: declarations,
    exports: declarations,
    bootstrap: []
})
export class AAComponentsModule {
}
