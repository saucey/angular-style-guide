import { Component, OnInit } from "@angular/core";
import { WiaPageService } from "./wia-page.service";

@Component({
  selector: 'aa-wia-page',
  providers: [WiaPageService],
  template: '<ng-content></ng-content>'
})

/**
 * Collapsible content component
 */
export class WiaPageComponent implements OnInit {

  constructor(private wiaPageService: WiaPageService) {

  }

  ngOnInit(): void {

  }

}
