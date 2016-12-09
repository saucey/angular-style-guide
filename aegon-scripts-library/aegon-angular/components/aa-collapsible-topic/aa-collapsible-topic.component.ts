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
import { WiaTopicDescriptionModel } from "../../modules/wia/wia-content/models/wia-topic-description.model";
import { WiaTopicModel } from "../../modules/wia/wia-content/models/wia-topic.model";
import { WIATealiumService } from "../../modules/wia/wia-page/wia-tealium.service";

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

  constructor (private wiaTealiumService: WIATealiumService) {}

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
   * @param {string} row
   * @param {string} column
   */
  public setActiveItem (row: string, column: string, title: string, imageName: string): void {
    this.setShowFullText(false, null, null);
    if (this.activeItem.row === row && this.activeItem.column === column) {
      this.activeItem.row = null;
      this.activeItem.column = null;
    } else {
      this.activeItem.row = row;
      this.activeItem.column = column;

      if (null !== title && null !== imageName) {
        this
          .wiaTealiumService
          .wiaClickOnSymbolIcon(title, imageName);
      }
    }
  }

  /**
   * Retrieves the active item
   *
   * @returns {Object}
   */
  public getActiveItem(): Object {
    return this.activeItem;
  }

  /**
   * Verifies if there is an active item on the current row but, not at the current column
   *
   * @param {string} row
   * @param {string} column
   * @returns {boolean}
   */
  public checkIfThereIsAnActiveItem (row: string, column: string): boolean {
    if (null !== this.activeItem.row && null !== this.activeItem.column && row === this.activeItem.row && column !== this.activeItem.column) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Checks if the full description is shown
   *
   * @param {WiaTopicModel} description
   * @returns {boolean}
   */
  public isFullTextShown (description: WiaTopicModel): boolean {
    return this.showFullText && this.isDescriptionTextValid(description);
  }

  /**
   * Changes the visibility of the description
   *
   * @param {boolean} showFullText
   */
  public setShowFullText (showFullText: boolean, title: string, imageName: string) {
    this.showFullText = showFullText;
    if (showFullText) {
      this
        .wiaTealiumService
        .wiaClickOnReadMore(title, imageName);
      this.visibility = 'shown';
    } else {
      this.visibility = 'hidden';
    }
  }

  /**
   * Checks if the description has the text property and value
   *
   * @param {WiaTopicModel} description
   * @returns {boolean}
   */
  public isDescriptionTextValid (description: WiaTopicModel): boolean {
    if (description.hasOwnProperty('longDescription') && typeof description.longDescription != 'undefined' && description.longDescription != null && description.longDescription.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  ngOnInit(): void {
  }

  /**
   * Shows the mobile icons for the specified row
   *
   * @param {string} row
   * @returns {boolean}
   */
  public showMobileIcons = (row: string): boolean => {
    if (row === this.activeMobileRow) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Shows the icons when on mobile
   *
   * @param {string} row
   */
  public showIconsOnMobile = (row: string) => {
    this.setActiveItem(null, null, null, null);

    if (row === this.activeMobileRow) {
      this.activeMobileRow = null;
    } else {
      this.activeMobileRow = row;
    }
  }
}
