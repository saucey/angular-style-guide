/**
 * AA-tabs-view component
 *
 * Component displays data splitted into tabs.
 *
 * @example
 * <aa-tabs-view active="home">
 *     <aa-tabs-view-item id="home" title="Item #1" icon="home" description="">
 *         Item #1 Content
 *     </aa-tabs-view-item>
 *     <aa-tabs-view-item id="help" title="Item #2" icon="help" description="">
 *         Item #1 Content
 *     </aa-tabs-view-item>
 * </aa-tabs-view>
 */
import { Component, AfterContentInit, ContentChildren, ElementRef, Input } from "@angular/core";
import { AATabsViewItemComponent } from "./aa-tabs-view-item.component";
import { AABaseComponent } from "../../lib/classes/AABaseComponent";
import { Parent } from "../../lib/classes/AAParent";

const template = require('./template.html');

@Component({
    selector: 'aa-tabs-view',
    template: template
})

export class AATabsViewComponent extends AABaseComponent implements AfterContentInit, Parent {

    @Input() active: string;
    @Input() options: any = {};
    @ContentChildren(AATabsViewItemComponent) tabs;

    name = 'AATabsViewComponent';


    constructor(elementRef: ElementRef) {
        super(elementRef);
    }

    setActive(tab: AATabsViewItemComponent) {
        this.onActiveStateChange(tab);
    }

    public setActiveById(id: string) {
        this.setActive(this.tabs.filter(el => el.id === id)[0])
    }

    onActiveStateChange(tab) {

        this.tabs.forEach((tab: AATabsViewItemComponent) => tab.setInactive());
        tab.setActive();
    }

    ngAfterContentInit() {

        this.setActiveById(this.active);

        this.tabs.forEach((tab: AATabsViewItemComponent) => {
            tab.setChangeCallback(this.onActiveStateChange.bind(this));
        });
    }
}
