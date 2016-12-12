import {
  Component, AfterViewInit
} from '@angular/core';
import { FNOLTealiumService } from "./fnol-tealium.service";

const template = require('./template.html');

@Component({
  selector: 'fnol-page',
  template: template,
  providers: [
    FNOLTealiumService
  ]
})

/**
 * The parent component for the FNOL page
 */
export class FNOLPageComponent implements AfterViewInit {

  constructor(private fnolTealiumService: FNOLTealiumService) {}

  ngAfterViewInit(): void {
    this
      .fnolTealiumService
      .fnolToolLoaded();
  }

}

