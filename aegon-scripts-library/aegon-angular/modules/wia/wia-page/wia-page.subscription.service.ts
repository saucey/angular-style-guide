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

  //indicate if last emitted value was a navigation change
  public navigationMessage: boolean = false;

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

    this.externalInput$.filter(el => el !== null).subscribe(callback, () => {});
  }

  // navigation flag indicates that change was emmitted by back button
  public emit (value: WIAInputModel, navigation: boolean = false) {
    this.navigationMessage = navigation;
    this.externalInput$.next(value);
  }

  private initSubscriptions () {

    const urlConfiguration = this.getUrlConfiguration();
    this.externalInput$ = new BehaviorSubject(urlConfiguration);

    if (this.hasUrlConfiguration() && urlConfiguration === null) {

      this.externalInput$.error({
        type: 'code',
        message: 'Invalid Personalization Code'
      });
    }

    // Update url every time new input is emitted
    this.externalInput$.subscribe(newInput => {

      if (newInput) {
        const code = this.wiaPagePersonalizationService.inputToCode(newInput);
        this.wiaUrlStateManager.setUrlCode(code);
      }
    }, () => {});
  }

  private hasUrlConfiguration(): boolean {

    return !!this.wiaUrlStateManager.getUrlCode();
  }

  private getUrlConfiguration(): WIAInputModel {

    const code = this.wiaUrlStateManager.getUrlCode();

    if (this.wiaPagePersonalizationService.isCodeValid(code)) {
      return this.wiaPagePersonalizationService.codeToInput(code);
    }

    return null;
  }
}
