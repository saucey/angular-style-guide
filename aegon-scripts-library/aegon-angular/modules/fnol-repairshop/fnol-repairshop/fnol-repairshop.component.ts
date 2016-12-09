import {
  Component, Input
} from '@angular/core';

import { FnolRepairshopService } from "../shared/services/fnol.data.service";
import { OrderBy } from "../../../pipes/orderBy.pipe";


const template = require('./template.html');

const INFO_FORM: string = 'info_form';
const RESULT_MOBILE: string = 'result_mobile';

@Component({
  selector: 'fnol-repairshop',
  template: template,
  providers: [
    FnolRepairshopService,
    OrderBy
  ]
})

export class FNOLRepairshopComponent {

  public isHideRepairshopResults: boolean = true;
  public isHideMobileRepairshopResults: boolean = true;
  public isShowPaginateInfo: boolean = false;
  public getItemShown: string = INFO_FORM;
  public parties = [];
  public sortedBy = 'ranking';
  public sortDirection = 'DESC';
  public loadingResults = false;
  public formSubmitted = false;

  public repairshop = {
    postcode: null,
    distance: 10,
    damage: null
  };

  constructor(private fnolRepairshopService: FnolRepairshopService, private orderByPipe: OrderBy) {
  }

  public repairshopFormSubmit() {
    this.isHideRepairshopResults = true;
    this.formSubmitted = true;

    // fields are valid
    if (false === this.isPostcodeEmpty(this.repairshop.postcode) && this.isPostcodeValid(this.repairshop.postcode) && false === this.isDamageUnselected(this.repairshop.damage)) {
      this.loadingResults = true;

      this
        .fnolRepairshopService
        .getData({
          location: this.repairshop.postcode,
          radius: this.repairshop.distance,
          type: this.repairshop.damage
        })
        .subscribe(results => {
          this.parties = results;
          this.getRepairshopSearchData();
          this.showPaginateInfo();
          this.getItemShown = RESULT_MOBILE;
          this.loadingResults = false;
          this.orderByPipe.transform(this.parties, this.sortedBy, this.sortDirection);
        });
    }
  }

  /**
   * Checks if the postcode is empty or null
   *
   * @param {string|null} postcode
   * @returns {boolean}
   */
  public isPostcodeEmpty(postcode): boolean {
    if ('undefined' === typeof postcode || null === postcode || 0 === postcode.length) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Checks if the postcode is valid
   *
   * @param {string} postcode
   * @returns {boolean}
   */
  public isPostcodeValid(postcode): boolean {
    if (/^[1-9][0-9]{3}\s?[a-zA-Z]{2}$/.test(postcode) || /^(?=(\s*[a-zA-Z]){1,25}$).*$/.test(postcode)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Checks if damage field is unselected
   *
   * @param {string} damage
   * @returns {boolean}
   */
  public isDamageUnselected(damage): boolean {
    if ('undefined' === typeof damage || null === damage || 0 === damage.length) {
      return true;
    } else {
      return false;
    }
  }

  getRepairshopSearchData() {
    this.isHideRepairshopResults = false;
    this.isHideMobileRepairshopResults = false;
  }

  hideMobileResults() {
    this.isHideMobileRepairshopResults = true;
    this.getItemShown = INFO_FORM;
  }

  showPaginateInfo() {
    if (this.parties.length >= 10) {
      this.isShowPaginateInfo = true;
    } else {
      this.isShowPaginateInfo = false;
    }
  }

  public sortByKey(sortProperty) {
    if (this.sortedBy === sortProperty) {
      if (this.sortDirection === 'ASC') {
        this.sortDirection = 'DESC';
      } else {
        this.sortDirection = 'ASC';
      }
    } else {
      this.sortedBy = sortProperty;
      this.sortDirection = 'ASC';
    }

    this.orderByPipe.transform(this.parties, this.sortedBy, this.sortDirection);
  }
}


