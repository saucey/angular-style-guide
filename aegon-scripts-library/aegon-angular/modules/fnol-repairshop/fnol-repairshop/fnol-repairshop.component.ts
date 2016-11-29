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
    public getItemShown: string = INFO_FORM;
    public parties = [];

    public repairshop = {
        postcode: null,
        distance: null,
        damage: null
    };

    constructor(private fnolRepairshopService: FnolRepairshopService) {}

    public repairshopFormSubmit() {
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
                this.getItemShown = RESULT_MOBILE;
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

}

