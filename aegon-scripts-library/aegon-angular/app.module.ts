//Angular modules
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

//Shared modules
import { AAComponentsModule, AAComponentsExports } from './aa.module';
import { DeprecatedComponentsModule, DeprecatedComponentsModuleExports } from './deprecated-components.module';

//Application modules
import { WiaPageModule, WiaPageExports } from './modules/wia/wia.module';
import { FNOLPageModule, FNOLPageExports } from './modules/fnol/fnol.module';

@NgModule({
    imports: [
        BrowserModule,

        AAComponentsModule,
        DeprecatedComponentsModule,
        
        WiaPageModule,
        FNOLPageModule
    ],
    exports: [
        ...AAComponentsExports,
        ...DeprecatedComponentsModuleExports,
        
        ...WiaPageExports,
        ...FNOLPageExports
    ],
    bootstrap: []
})
export class AppComponentModule {
}
