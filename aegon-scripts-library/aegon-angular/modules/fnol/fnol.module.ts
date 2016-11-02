import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AAComponentsModule } from '../../aa.module';
import { DeprecatedComponentsModule } from '../../deprecated-components.module';


import { FNOLIntakeComponent } from './fnol-page/aa-fnol-intake.component';
import { FNOLCategory } from './fnol-category/fnol-category.component';
import { FNOLEndpoint } from './fnol-endpoint/fnol-endpoint.component';

export const FNOLPageExports = [
  FNOLIntakeComponent,
  FNOLEndpoint,
  FNOLCategory
];

export const declarations = [
    ...FNOLPageExports
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
  exports: FNOLPageExports
})


export class FNOLPageModule{

}
