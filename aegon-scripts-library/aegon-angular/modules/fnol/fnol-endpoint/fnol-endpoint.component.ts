import { Component, Input, ElementRef, forwardRef } from "@angular/core";

import { FNOLDataService } from "../shared/services/fnol.data.service";
import { Endpoint } from "../shared/models";
import { AABaseComponent } from "../../../lib/classes/AABaseComponent";
import { Parent } from "../../../lib/classes/AAParent";
import { AATabsViewComponent } from "../../../components/aa-tabs-view/aa-tabs-view.component";

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

    data: Endpoint;

    constructor(private elementRef: ElementRef,
                private fnolDataService: FNOLDataService,
                private tabsView: Parent) {

        super(elementRef);
    }

    setActiveById (id: string): void {

        if (this.tabsView) {
            (this.tabsView as AATabsViewComponent).setActiveById(id)
        }
    }

    ngOnInit() {
        this.data = this.fnolDataService.getEndpoint(this.id)
    }
}

