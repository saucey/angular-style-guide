import { Component, AfterViewInit } from "@angular/core";
import { CalculatorDataService } from "../wia-calculator/wia-calculator-data.service";
import { WIATealiumService } from "./wia-tealium.service";

@Component({
  selector: 'aa-wia-page',
  providers: [
    CalculatorDataService,
    WIATealiumService
  ],
  template: '<ng-content></ng-content>'
})

/**
 * The parent component for the Wia page.
 */
export class WiaPageComponent implements AfterViewInit {

  constructor (private wiaTealiumService: WIATealiumService) {}

  ngAfterViewInit(): void {
    this
      .wiaTealiumService
      .wiaToolLoaded();
  }
}
