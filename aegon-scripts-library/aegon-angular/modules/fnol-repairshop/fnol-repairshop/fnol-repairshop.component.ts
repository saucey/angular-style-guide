import {
    Component, Input
} from '@angular/core';

import {FnolRepairshopService} from "../shared/services/fnol.data.service";

const template = require('./template.html');

@Component({
    selector: 'fnol-repairshop',
    template: template,
    providers: [FnolRepairshopService]
})
export class FNOLRepairshopComponent {

    public isHideRepairshopResults: boolean = true;
    public isHideMobileRepairshopResults: boolean = true;
    public isMobileView: boolean = false;
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
                this.hideMobileInputForm();
            });
    }

    getRepairshopSearchData() {
        this.isHideRepairshopResults = false;
        this.isHideMobileRepairshopResults = false;
    }

    hideMobileResults() {
        this.isHideMobileRepairshopResults = true;
        this.isMobileView = false;
    }

// if click mobile view search button then form component hide show only result component

    hideMobileInputForm() {
       this.isMobileView = true;
    }

}

