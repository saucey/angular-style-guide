import { Component, Input, OnInit } from "@angular/core";
import { FNOLDataService } from "../shared/services/fnol.data.service";
import { Category, Step } from "../shared/models";

const template = require('./template.html');

@Component({
    selector: 'fnol-category',
    template: template,
    providers: [FNOLDataService]
})

export class FNOLCategory implements OnInit {

    @Input() id: string;

    // Current category data
    category: Category;

    // Visible steps - questions/endpoints
    steps: Step[] = [];

    constructor(private fnolDataService: FNOLDataService) {}

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
    }
}

