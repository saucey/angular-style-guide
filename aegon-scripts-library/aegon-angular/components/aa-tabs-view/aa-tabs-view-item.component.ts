import { Component, Input } from "@angular/core";

const template = require('./aa-tabs-view-item.html');

@Component({
    selector: 'aa-tabs-view-item',
    template: template
})

export class AATabsViewItemComponent {

    @Input() title: string = '';
    @Input() icon: string = '';
    @Input() description: string = '';
    @Input() active: boolean = false;

    private changeCallback : Function;

    setActive(notifyTabsView : boolean = false) {
        this.active = true;

        if (notifyTabsView) {
            this.notifyTabsView();
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
