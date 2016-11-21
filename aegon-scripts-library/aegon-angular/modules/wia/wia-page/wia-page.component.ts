import { Component } from "@angular/core";
import { CalculatorDataService } from "../wia-calculator/wia-calculator-data.service";

@Component({
  selector: 'aa-wia-page',
  providers: [CalculatorDataService],
  template: '<ng-content></ng-content>'
})

/**
 * The parent component for the Wia page.
 */
export class WiaPageComponent {

}
