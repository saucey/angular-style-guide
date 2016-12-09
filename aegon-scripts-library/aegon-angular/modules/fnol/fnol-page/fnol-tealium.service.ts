import { Injectable } from "@angular/core";
import { aegonTealium } from "../../../lib/aegon_tealium";

/**
 * FNOLTealiumService created on 12/9/16 1:41 PM.
 *
 * @description FNOL wrapper for Tealium API
 * @author Florian Popa <florian@webgenerals.com>
 */

@Injectable()
export class FNOLTealiumService {

  /*

   {
     page_cat_1_type: '',
     page_cat_2_name: '',
     page_cat_3_section: '',
     page_cat_4_productgroup: '',
     page_cat_5_product: '',
     page_step: '',
     product_name: '',
     product_category: [""],
     event: '',
     funnelName: '',
     newpageName: '',
     newpage_step_name: ''
   }

   */

  public fnolToolLoaded() {
    aegonTealium({
      page_cat_1_type: '',
      page_cat_2_name: '',
      page_cat_3_section: '',
      page_cat_4_productgroup: '',
      page_cat_5_product: '',
      page_step: '',
      product_name: '',
      product_category: [""],
      event: '',
      funnelName: '',
      newpageName: '',
      newpage_step_name: ''
    });
  }

  public phoneNumberToCallMobile() {

  }

  public clickDamageCategoryInboedel() {

  }

  public clickDamageCategoryOpstal() {

  }

  public clickDamageCategoryAuto() {

  }

  public clickDamageCategoryAansprakelijkheid() {

  }

  public clickDamageCategoryReis() {

  }

  public endOfFunnelReachedForInboedel() {

  }

  public endOfFunnelReachedForOpstal() {

  }

  public endOfFunnelReachedForAuto() {

  }

  public endOfFunnelReachedForAansprakelijkheid() {

  }

  public endOfFunnelReachedForReis() {

  }

  public endOfFunnelReachedForReis() {

  }

  public clickOnPhoneNumberToCallAtEndOfFunnelForInboedel() {

  }

  public clickOnPhoneNumberToCallAtEndOfFunnelForOpstal() {

  }

  public clickOnPhoneNumberToCallAtEndOfFunnelForAuto() {

  }

  public clickOnPhoneNumberToCallAtEndOfFunnelForAansprakelijkheid() {

  }

  public clickOnPhoneNumberToCallAtEndOfFunnelForReis() {

  }

}
