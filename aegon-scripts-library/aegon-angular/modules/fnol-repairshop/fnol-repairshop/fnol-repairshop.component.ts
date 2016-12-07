import {
  Component, Input
} from '@angular/core';

import {FnolRepairshopService} from "../shared/services/fnol.data.service";

const template = require('./template.html');

const INFO_FORM: string = 'info_form';
const RESULT_MOBILE: string = 'result_mobile';

@Component({
  selector: 'fnol-repairshop',
  template: template,
  providers: [FnolRepairshopService]
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

  public repairshop = {
    postcode: null,
    distance: 10,
    damage: null
  };

  constructor(private fnolRepairshopService: FnolRepairshopService) {
  }

  public repairshopFormSubmit() {
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
      });
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
  }
}

