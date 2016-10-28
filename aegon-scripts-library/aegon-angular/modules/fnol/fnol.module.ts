import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { AAComponentsModule } from '../../aa.module';
import { DeprecatedComponentsModule } from '../../deprecated-components.module';

import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

import { FNOLIntakeComponent } from './fnol-page/aa-fnol-intake.component';

export const FNOLPageExports = [
  FNOLIntakeComponent
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
