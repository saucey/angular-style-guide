/**
 * aa-collapsible-topic.component created on 10/18/16 10:29 AM.
 *
 * @description Provides structure for displaying collapsible topics
 * @author Florian Popa <florian@webgenerals.com>
 */

import {Component, ElementRef, OnInit, OnChanges, Input, trigger, state, animate, transition, style} from "@angular/core";

@Component({
  selector: 'aa-collapsible-topic',
  template: require('./template.html'),
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

export class AACollapsibleTopicComponent implements OnInit {

  @Input()
  topicsCollection: string[];

  /**
   * Active item location by row and column
   */
  public activeItem = {
    row: null,
    column: null
  };

  public showFullText: boolean = false;

  public visibility: string = 'hidden';

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
    if (description.hasOwnProperty('longDescription') && typeof description.longDescription != 'undefined' && description.longDescription != null && description.longDescription.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  /**
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
      return true;
      // search for the filter in selected attributes
      // if it matches then return true
      // else false
    }
  }


  ngOnInit(): void {

  }

}
