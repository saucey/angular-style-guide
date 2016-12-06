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

declare const jQuery;

@Component({
    selector: 'aa-tabs-view',
    template: template
})

export class AATabsViewComponent extends AABaseComponent implements AfterContentInit, Parent {

    @Input() active: string;

    //scroll tabs section to view when tabs content is outside of viewport
    @Input() scrollToView: boolean = true;
    @Input() activeIndex: string;
    @Input() options: any = {};
    @Input() theme: string = 'square-blue';
    @ContentChildren(AATabsViewItemComponent) tabs;

    private changeCallbacks: Array<Function> = [];

    name = 'AATabsViewComponent';


    constructor(private elementRef: ElementRef) {
        super(elementRef);
    }

    public setActive(tab: AATabsViewItemComponent) {
        this.active = tab.id;
        this.activeIndex = this.tabs.toArray().indexOf(tab) + 1;
        this.onActiveStateChange(tab);

        if (this.scrollToView) {
          this.scrollToViewAction();
        }
    }

    public setActiveById(id: string) {
        this.setActive(this.tabs.filter(el => el.id === id)[0])
    }

    public onActiveStateChange(tab) {

        this.tabs.forEach((tab: AATabsViewItemComponent) => tab.setInactive());
        tab.setActive();

        this.changeCallbacks.forEach(func => func(tab));
    }

    // Add callback to be notified about tab changes
    public onTabChange(callback: Function): void {
        this.changeCallbacks.push(callback);
    }

    private scrollToViewAction () {
      const $tabs = this.elementRef.nativeElement.querySelector('.aa-tabs-view');
      const positionFromTop = window.scrollY + $tabs.getClientRects()[0].top;
      const EXTRA_SPACE = 50;

      //mobile view - scroll to beginning of the element
      let scrollPosition =  positionFromTop - EXTRA_SPACE;

      //scroll only when element is outside of the viewport
      if (scrollPosition > window.scrollY) {
        jQuery('html,body').animate({
          scrollTop: scrollPosition
        })
      }
    }

    public ngAfterContentInit() {

        if (this.active) {
            this.setActiveById(this.active);
        }

        this.tabs.forEach((tab: AATabsViewItemComponent) => {
            tab.setChangeCallback(this.onActiveStateChange.bind(this));
        });
    }
}
