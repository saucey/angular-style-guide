/**
 * AA-tabs-view component
 *
 * Component displays data splitted into tabs.
 *
 * @example
 * <aa-tabs-view>
 *     <aa-tabs-view-item title="Item #1" icon="home" description="">
 *         Item #1 Content
 *     </aa-tabs-view-item>
 *     <aa-tabs-view-item title="Item #2" icon="help" description="">
 *         Item #1 Content
 *     </aa-tabs-view-item>
 * </aa-tabs-view>
 */
import { Component, AfterContentInit, ContentChildren } from "@angular/core";

import { AATabsViewItemComponent } from "./aa-tabs-view-item.component"

const template = require('./template.html');

@Component({
    selector: 'aa-tabs-view',
    template: template
})

export class AATabsViewComponent implements AfterContentInit {

    @ContentChildren(AATabsViewItemComponent) tabs;

    setActive (tab : AATabsViewItemComponent) {

        this.onActiveStateChange(tab);
    }

    onActiveStateChange (tab) {

        this.tabs.forEach((tab: AATabsViewItemComponent) => tab.setInactive());

        tab.setActive();
    }

    ngAfterContentInit () {

        this.tabs.forEach((tab: AATabsViewItemComponent) => {
            tab.setChangeCallback(this.onActiveStateChange.bind(this));
        });
    }
}
