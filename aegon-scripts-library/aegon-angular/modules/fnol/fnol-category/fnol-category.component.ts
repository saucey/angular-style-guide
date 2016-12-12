import { Component, Input, OnInit, ElementRef, NgZone, forwardRef } from "@angular/core";
import { FNOLDataService } from "../shared/services/fnol.data.service";
import { Category, Step } from "../shared/models";
import { clone } from "../../../lib/util";
import { Parent } from "../../../lib/classes/AAParent";
import { AATabsViewComponent } from "../../../components/aa-tabs-view/aa-tabs-view.component";
import { FNOLTealiumService } from "../fnol-page/fnol-tealium.service";

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
                private fnolDataService: FNOLDataService,
                private fnolTealiumService: FNOLTealiumService
    ) {}

    ngOnInit() {
        this.init();

      if (this.tabsView) {
        (this.tabsView as AATabsViewComponent).onTabChange((tab) => {
          if (this.category.id === tab.id) {
            switch (this.category.id) {
              case 'possession':
                  this
                    .fnolTealiumService
                    .clickDamageCategoryInboedel();
                break;
              case 'home':
                  this
                    .fnolTealiumService
                    .clickDamageCategoryOpstal();
                break;
              case 'auto':
                this
                  .fnolTealiumService
                  .clickDamageCategoryAuto();
                break;
              case 'liability':
                  this
                    .fnolTealiumService
                    .clickDamageCategoryAansprakelijkheid();
                break;
              case 'travel':
                this
                  .fnolTealiumService
                  .clickDamageCategoryReis();
                break;
            }

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

        this.triggerTealiumForEndpoints(nextStepId);
    }

    private triggerTealiumForEndpoints(stepId) {
        if (stepId.indexOf('END_POSSESSION') !== -1) {
          console.log('inboedel');
          this.fnolTealiumService.endOfFunnelReachedForInboedel();
        }

        if (stepId.indexOf('END_HOME') !== -1) {
          console.log('opstal');
          this.fnolTealiumService.endOfFunnelReachedForOpstal();
        }

        if (stepId.indexOf('END_AUTO') !== -1) {
          console.log('auto');
          this.fnolTealiumService.endOfFunnelReachedForAuto();
        }

        if (stepId.indexOf('END_TRAVEL') !== -1) {
          console.log('aansprakelijkheid');
          this.fnolTealiumService.endOfFunnelReachedForAansprakelijkheid();
        }

        if (stepId.indexOf('END_LIABILITY') !== -1) {
          console.log('reis');
          this.fnolTealiumService.endOfFunnelReachedForReis();
        }
    }

    scrollToLastQuestion () {

        const $lastQuestion = this.elementRef.nativeElement.querySelector('.fnol-category__question:last-child');
        const positionFromTop = window.scrollY + $lastQuestion.getClientRects()[0].top;
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

