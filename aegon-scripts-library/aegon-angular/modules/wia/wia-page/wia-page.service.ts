import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { WIAInputEntity } from "./models/wia-input.entity";
import { WiaPageProductsService } from "./wia-page.products.service";
import { WiaPagePersonalizationService } from "./wia-page.personalization.service";

@Injectable()
export class WiaPageService {

  private static singleton: WiaPageService;
  private wiaPageProductsService: WiaPageProductsService;
  private wiaPagePersonalizationService: WiaPagePersonalizationService;

  public externalInput$: BehaviorSubject<WIAInputEntity>;

  private DEFAULT_CONFIGURATION = {
    income: null,
    productsIds: [],
    products: []
  };

  constructor() {

    if (!WiaPageService.singleton) {
      WiaPageService.singleton = this;
      this.wiaPageProductsService = new WiaPageProductsService();
      this.wiaPagePersonalizationService = new WiaPagePersonalizationService();

      this.externalInput$ = new BehaviorSubject(this.getUrlConfiguration() || this.getDefaultConfiguration());

      this.externalInput$.subscribe(newInput => {

        // console.log('Obervable:', newInput);
        this.wiaPagePersonalizationService.setUrlConfiguration(newInput);
      });
    }

    return WiaPageService.singleton;
  }

  private getDefaultConfiguration(): WIAInputEntity {
    return this.DEFAULT_CONFIGURATION;
  }

  private getUrlConfiguration(): WIAInputEntity {

    return this.wiaPagePersonalizationService.getUrlConfiguration();
  }

}
