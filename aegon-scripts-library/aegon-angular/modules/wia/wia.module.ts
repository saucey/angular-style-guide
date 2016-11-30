import { NgModule, ErrorHandler } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { HttpModule } from "@angular/http";

import { AAComponentsModule } from "../../aa.module";
import { DeprecatedComponentsModule } from "../../deprecated-components.module";

import { WiaCalculatorComponent } from "./wia-calculator/wia-calculator.component";
import { WiaCalculatorGraphComponent } from "./wia-calculator-graph/wia-calculator-graph.component";
import { WiaContentComponent } from "./wia-content/wia-content.component";
import { WiaFormComponent } from "./wia-form/wia-form.component";
import { WiaPageComponent } from "./wia-page/wia-page.component";
import { WIAErrorHandlerService } from "./wia-content/wia-error-handler.service";

export const WiaPageExports = [
  WiaCalculatorComponent,
  WiaFormComponent,
  WiaPageComponent,
  WiaContentComponent
];

export const declarations = [
  WiaCalculatorGraphComponent,
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
  exports: WiaPageExports,
  providers: [
    {
      provide: ErrorHandler, useClass: WIAErrorHandlerService
    }
  ]
})
export class WiaPageModule {
}
