import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AAComponentsModule } from '../../aa.module';
import { DeprecatedComponentsModule } from '../../deprecated-components.module';


import { FNOLRepairshopComponent } from './fnol-repairshop/fnol-repairshop.component';

export const FNOLRepairshopPageExports = [
  FNOLRepairshopComponent
];

export const declarations = [
    ...FNOLRepairshopPageExports
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
  exports: FNOLRepairshopPageExports
})


export class FNOLRepairshopPageModule{

}
