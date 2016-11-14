/**
 * AACollapsibleTopicComponent created on 10/18/16 10:29 AM.
 *
 * @description Provides structure for displaying collapsible topics
 * @author Florian Popa <florian@webgenerals.com>
 */

import {
  Component,
  ElementRef,
  OnInit,
  OnChanges,
  Input,
  trigger,
  state,
  animate,
  transition,
  style
} from "@angular/core";

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

  public activeItem = {
    row: null,
    column: null
  };
  public showFullText: boolean = false;
  public visibility: string = 'hidden';
  public activeMobileRow = null;

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

  /**
   * Checks if the full description is shown
   *
   * @param description
   * @returns {boolean}
   */
  public isFullTextShown = (description) => {
    return this.showFullText && this.isDescriptionTextValid(description);
  }

  /**
   * Changes the visibility of the description
   *
   * @param showFullText
   */
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

  ngOnInit(): void {
  }

  public showMobileIcons = (row) => {
    if (row === this.activeMobileRow) {
      return true;
    } else {
      return false;
    }
  };

  /**
   * Shows the icons when on mobile
   *
   * @param row
   */
  public showIconsOnMobile = (row) => {
    this.activeMobileRow = row;
  };

  /**
   * Hides the icons when on mobile
   */
  public hideIconsOnMobile = () => {
    this.activeMobileRow = null;
  };

}
