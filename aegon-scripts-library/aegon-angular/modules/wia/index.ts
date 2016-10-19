import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { AAComponentsModule } from '../../aa.module';
import { DeprecatedComponentsModule } from '../../deprecated-components.module';

import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

import { WiaCalculator } from './wia-calculator/aa-wia-calculator.component';
import { WiaCalculatorGraph } from './wia-calculator-graph/aa-wia-calculator-graph.component';
import { WiaContentComponent } from './wia-content/aa-wia-content.component';

export const WiaPageExports = [
    WiaCalculator,
    WiaContentComponent
];

export const declarations = [
    WiaCalculatorGraph,
    ...WiaPageExports
];

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        AAComponentsModule,
        DeprecatedComponentsModule
    ],
    declarations,
    exports: WiaPageExports
})
export class WiaPageModule {
}
