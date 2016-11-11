import { Component, Input, OnInit, ElementRef, NgZone } from "@angular/core";
import { FNOLDataService } from "../shared/services/fnol.data.service";
import { Category, Step } from "../shared/models";

const template = require('./template.html');

declare const jQuery;

@Component({
    selector: 'fnol-category',
    template: template,
    providers: [FNOLDataService]
})

export class FNOLCategoryComponent implements OnInit {

    @Input() id: string;

    // Current category data
    category: Category;

    // Visible steps - questions/endpoints
    steps: Array<Step> = [];

    constructor(private elementRef: ElementRef,
                private _ngZone: NgZone,
                private fnolDataService: FNOLDataService) {}

    ngOnInit() {
        this.category = this.fnolDataService.getCategory(this.id);

        this.steps.push(
            this.fnolDataService.getStep(this.category.startingStep)
        );
    }

    // tracking by id prevents ngFor loop from recreating items
    // to preserve user answers on every update we must use it
    trackById(index, el) {
        return el.id;
    }

    setNextStep(nextStepId: string, currentStepIndex: number) {

        // Make sure all questions after this one are removed
        // Used when user edits previous question or changes his answer
        this.steps = this.steps.splice(0, currentStepIndex + 1);

        this.steps.push(
            this.fnolDataService.getStep(nextStepId)
        );

        this._ngZone.runOutsideAngular(() => {
           setTimeout(() => {
               this.scrollToLastQuestion();
           })
        });
    }

    scrollToLastQuestion () {

        const $lastQuestion = this.elementRef.nativeElement.querySelector('.fnol-category__question:last-child');
        const positionFromTop = window.scrollY + $lastQuestion.getClientRects()[0].top;

        //mobile view - scroll to beginning of the element
        let scrollPosition =  positionFromTop;

        if (window.innerHeight > $lastQuestion.scrollHeight) {
          //position of a screen that contains entire lastQuestion element on the bottom of the window
          scrollPosition =  positionFromTop - window.innerHeight + $lastQuestion.scrollHeight;
        }

        //scroll only when element is outside of the viewport
        if (scrollPosition > window.scrollY) {
            jQuery(window.document.body).animate({
                scrollTop: scrollPosition
            })
        }

    }
}

