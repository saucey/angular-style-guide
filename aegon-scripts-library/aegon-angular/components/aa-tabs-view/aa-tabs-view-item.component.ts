import { Component, Input } from "@angular/core";

const template = require('./aa-tabs-view-item.html');

@Component({
    selector: 'aa-tabs-view-item',
    template: template
})

export class AATabsViewItemComponent {

    @Input() id: string;
    @Input() title: string;
    @Input() icon: string;
    @Input() description: string;
    @Input() active: boolean = false;

    private changeCallback : Function;

    // if isMobile=true toggle if already active
    setActive(notifyTabsView: boolean = false, isMobile: boolean = false) {

        if (isMobile && this.active) {
            this.active = false;
        } else {
            this.active = true;
            if (notifyTabsView) {
              this.notifyTabsView();
            }
        }

    }

    notifyTabsView() {
        this.changeCallback(this);
    }

    setChangeCallback (callback) {
        this.changeCallback = callback;
    }

    setInactive() {
        this.active = false;
    }
}
