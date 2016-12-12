import { Component, Input, ElementRef, forwardRef } from "@angular/core";

import { FNOLDataService } from "../shared/services/fnol.data.service";
import { Endpoint } from "../shared/models";
import { AABaseComponent } from "../../../lib/classes/AABaseComponent";
import { Parent } from "../../../lib/classes/AAParent";
import { AATabsViewComponent } from "../../../components/aa-tabs-view/aa-tabs-view.component";
import { FNOLTealiumService } from "../fnol-page/fnol-tealium.service";

const template = require('./template.html');

@Component({
    selector: 'fnol-endpoint',
    template: template,
    providers: [
        FNOLDataService,
        { provide: Parent, useExisting: forwardRef(() => AATabsViewComponent) }
    ]
})

export class FNOLEndpointComponent extends AABaseComponent {

    @Input() id: string;

    endpoint: Endpoint;

    constructor(private elementRef: ElementRef,
                private fnolDataService: FNOLDataService,
                private tabsView: Parent,
                private fnolTealiumService: FNOLTealiumService
    ) {

        super(elementRef);
    }

    setActiveById (id: string): void {
        if (this.tabsView) {
            (this.tabsView as AATabsViewComponent).setActiveById(id)
        }
    }

    triggerTealiumForEndpointCall(endpointId): void {
      if (endpointId.indexOf('END_POSSESSION') !== -1) {
        this.fnolTealiumService.clickOnPhoneNumberToCallAtEndOfFunnelForInboedel();
      }

      if (endpointId.indexOf('END_HOME') !== -1) {
        this.fnolTealiumService.clickOnPhoneNumberToCallAtEndOfFunnelForOpstal();
      }

      if (endpointId.indexOf('END_AUTO') !== -1) {
        this.fnolTealiumService.clickOnPhoneNumberToCallAtEndOfFunnelForAuto();
      }

      if (endpointId.indexOf('END_TRAVEL') !== -1) {
        this.fnolTealiumService.clickOnPhoneNumberToCallAtEndOfFunnelForAansprakelijkheid();
      }

      if (endpointId.indexOf('END_LIABILITY') !== -1) {
        this.fnolTealiumService.clickOnPhoneNumberToCallAtEndOfFunnelForReis();
      }
    }

    ngOnInit() {
        this.endpoint = this.fnolDataService.getEndpoint(this.id);
    }
}

