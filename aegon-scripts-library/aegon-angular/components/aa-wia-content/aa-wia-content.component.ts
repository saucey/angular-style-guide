/**
 * aa-wia-content.component.ts created on 9/29/16 2:20 PM.
 *
 * @description Provides functionality for showing/hiding content under headers.
 * @author Florian Popa <florian@webgenerals.com>
 */
import {
    Component, ElementRef, OnInit, OnChanges, Input,
    trigger, state, animate, transition, style
} from '@angular/core';

import {AABaseComponent} from "../../lib/classes/AABaseComponent";
const template = require('./template.html');

const contentData = require('./data.json');

@Component({
    selector: 'aa-wia-content',
    providers: [],
    template: template,
    animations: [

        trigger('shrinkOut', [
            state('in', style({
                height: '*'
            })),
            transition('void => *', [
                style({
                    height: 0
                }),
                animate('150ms 0 ease-out', style({
                    height: '*'
                }))
            ]),
            transition('* => void', [
                style({
                    height: '*'
                }),
                animate('150ms 0 ease-in', style({
                    height: 0
                }))
            ])
        ])
    ]
})

/**
 * Collapsible content component
 */
export class AAWiaContentComponent extends AABaseComponent implements OnInit {

    public productsList = [];

    public topicsList = contentData;

    /**
     * Active item location by row and column
     */
    public activeItem = {
        row: null,
        column: null
    };

    public activeRowId;

    public showFullText: boolean = false;

    public visibility: string = 'hidden';

    constructor(private elementRef: ElementRef) {
        super(elementRef);
    }

    /**
     * Sets the active item by row and column
     *
     * @param row
     * @param column
     */
    public setActiveItem = (row, column) => {
        this.setShowFullText(false);
        if (this.activeItem.row === row && this.activeItem.column === column) {
            this.activeItem.row = null;
            this.activeItem.column = null;
        } else {
            this.activeItem.row = row;
            this.activeItem.column = column;
        }
    }

    /**
     * Retrieves the active item
     *
     * @returns {Object}
     */
    public getActiveItem = () => {
        return this.activeItem;
    }

    public isFullTextShown = (description) => {
        return this.showFullText && this.isDescriptionTextValid(description);
    }

    public setShowFullText = (showFullText) => {
        this.showFullText = showFullText;
        if (showFullText) {
            this.visibility = 'shown';
        } else {
            this.visibility = 'hidden';
        }
    }

    /**
     * Checks if the description has the text property and value
     *
     * @param description
     * @returns {boolean}
     */
    public isDescriptionTextValid = (description) => {
        if (description.hasOwnProperty('text') && typeof description.text != 'undefined' && description.text != null && description.text.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     *
     *
     * @param {boolean|string} filter
     * @returns {boolean}
     */
    public filterTopic(filter) {
        if (filter === false) {
            return true;
        }

        if (filter === true) {
            return false;
        }

        if (typeof filter == 'string') {
            // search for the filter in selected attributes
            // if it matches then return true
            // else false
        }
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
