import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AAComponentsModule, AAComponentsExports } from './aa.module';
import { WiaPageModule, WiaPageExports } from './modules/wia/wia.module.ts';
import { DeprecatedComponentsModule, DeprecatedComponentsModuleExports } from './deprecated-components.module';

@NgModule({
    imports: [
        BrowserModule,

        AAComponentsModule,
        WiaPageModule,
        DeprecatedComponentsModule
    ],
    exports: [
        ...AAComponentsExports,
        ...WiaPageExports,
        ...DeprecatedComponentsModuleExports
    ],
    bootstrap: []
})
export class AppComponentModule {
}
