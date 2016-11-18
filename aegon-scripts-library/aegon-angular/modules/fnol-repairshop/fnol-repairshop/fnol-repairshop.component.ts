import {
  Component
} from '@angular/core';
import { FnolRepairshopService } from "../shared/services/fnol.data.service";

const template = require('./template.html');

@Component({
  selector: 'fnol-repairshop',
  template: template,
  providers: [FnolRepairshopService]
})

export class FNOLRepairshopComponent {

  constructor (private fnolRepairshopService: FnolRepairshopService) {

    this.fnolRepairshopService.getData({
      location: 'XXX',
      radius: 100,
      type: 'ZZZ'
    }).subscribe(results => {

      console.log('Parsed data: ', results);
    })
  }

}

