import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpModule } from "@angular/http";
import { AAComponentsModule } from "../../aa.module";
import { DeprecatedComponentsModule } from "../../deprecated-components.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { WiaCalculator } from "./wia-calculator/wia-calculator.component";
import { WiaCalculatorGraph } from "./wia-calculator-graph/wia-calculator-graph.component";
import { WiaContentComponent } from "./wia-content/wia-content.component";
import { WiaForm } from "./wia-form/wia-form.component";
import { WiaPage } from "./wia-page/wia-page.component";

export const WiaPageExports = [
  WiaCalculator,
  WiaForm,
  WiaPage,
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
