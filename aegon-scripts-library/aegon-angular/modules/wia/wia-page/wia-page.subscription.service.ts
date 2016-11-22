import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { WIAInputModel } from "./models/wia-input.model";
import { WiaPagePersonalizationService } from "./wia-page.personalization.service";
import { WiaUrlStateManager } from "./wia-page.url-state.service";

@Injectable()
export class WiaSubscriptionService {

  private static singleton: WiaSubscriptionService;
  private wiaPagePersonalizationService: WiaPagePersonalizationService;
  private wiaUrlStateManager: WiaUrlStateManager;

  public externalInput$: BehaviorSubject<WIAInputModel>;

  constructor() {

    if (!WiaSubscriptionService.singleton) {
      WiaSubscriptionService.singleton = this;

      this.wiaPagePersonalizationService = new WiaPagePersonalizationService();
      this.wiaUrlStateManager = new WiaUrlStateManager();

      this.initSubscriptions();
    }

    return WiaSubscriptionService.singleton;
  }

  public subscribe (callback) {

    this.externalInput$.filter(el => el !== null).subscribe(callback);
  }

  public emit (value: WIAInputModel) {
    this.externalInput$.next(value);
  }

  private initSubscriptions () {

    this.externalInput$ = new BehaviorSubject(this.getUrlConfiguration());

    // Update url every time new input is emitted
    this.externalInput$.subscribe(newInput => {

      if (newInput) {
        const code = this.wiaPagePersonalizationService.inputToCode(newInput);
        this.wiaUrlStateManager.setUrlCode(code);
      }
    });
  }

  private getUrlConfiguration(): WIAInputModel {

    const code = this.wiaUrlStateManager.getUrlCode();

    if (this.wiaPagePersonalizationService.isCodeValid(code)) {
      return this.wiaPagePersonalizationService.codeToInput(code);
    }

    return null;
  }
}
