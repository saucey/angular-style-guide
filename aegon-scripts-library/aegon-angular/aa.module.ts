import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

import { DeprecatedComponentsModule } from './deprecated-components.module'

import * as aaComp from './components';
import * as aaPipes from './pipes';
import { AAElementDirective } from './directives/aa-element/aa-element.directive.ts';
import { AATopicDirective } from './directives/aa-topic/aa-topic.directive';

const declarations = [
    AAElementDirective,
    AATopicDirective,
    aaComp.AABlueBlockPageComponent,
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
    aaComp.AABlueBlockComponent
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
