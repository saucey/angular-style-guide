import { Component, Input, OnInit, ElementRef, NgZone, forwardRef } from "@angular/core";
import { FNOLDataService } from "../shared/services/fnol.data.service";
import { Category, Step } from "../shared/models";
import { clone } from "../../../lib/util";
import { Parent } from "../../../lib/classes/AAParent";
import { AATabsViewComponent } from "../../../components/aa-tabs-view/aa-tabs-view.component";

const template = require('./template.html');

declare const jQuery;

@Component({
    selector: 'fnol-category',
    template: template,
    providers: [
      FNOLDataService,
      { provide: Parent, useExisting: forwardRef(() => AATabsViewComponent) }]
})

export class FNOLCategoryComponent implements OnInit {

    @Input() id: string;

    // Current category data
    category: Category;

    // Visible steps - questions/endpoints
    steps: Array<Step> = [];

    constructor(private elementRef: ElementRef,
                private _ngZone: NgZone,
                private tabsView: Parent,
                private fnolDataService: FNOLDataService) {}

    ngOnInit() {
        this.init();

      if (this.tabsView) {
        (this.tabsView as AATabsViewComponent).onTabChange((tab) => {
          if (this.category.id === tab.id) {
            //reset form every time tab is changed
            this.init();
          }
        })
      }
    }

    private init () {
      this.category = this.fnolDataService.getCategory(this.id);

      this.steps = [clone(this.fnolDataService.getStep(this.category.startingStep))];
    }

    // tracking by id prevents ngFor loop from recreating items
    // to preserve user answers on every update we must use it
    trackById(index, el) {
        return el;
    }

    setNextStep(nextStepId: string, currentStepIndex: number) {

        // Make sure all questions after this one are removed
        // Used when user edits previous question or changes his answer
        this.steps = this.steps.splice(0, currentStepIndex + 1);

        this.steps.push(
          clone(this.fnolDataService.getStep(nextStepId))
        );

        this._ngZone.runOutsideAngular(() => {
           setTimeout(() => {
               this.scrollToLastQuestion();
           })
        });
    }

    scrollToLastQuestion () {

        const $lastQuestion = this.elementRef.nativeElement.querySelector('.fnol-category__question:last-child');
        const positionFromTop = jQuery($lastQuestion).offset().top;

        const EXTRA_SPACE = 100;

        //mobile view - scroll to beginning of the element
        let scrollPosition =  positionFromTop;

        if (window.innerHeight > $lastQuestion.scrollHeight) {
          //position of a screen that contains entire lastQuestion element on the bottom of the window
          scrollPosition =  positionFromTop - window.innerHeight + $lastQuestion.scrollHeight + EXTRA_SPACE;
        }

        //scroll only when element is outside of the viewport
        if (scrollPosition > window.scrollY) {
            jQuery('html,body').animate({
                scrollTop: scrollPosition
            })
        }

    }
}

