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

  public fnolToolLoaded() {
    aegonTealium({
      page_cat_1_type: 'formulier',
      page_cat_2_name: 'schade melden en declareren',
      page_cat_3_section: 'particulier',
      page_cat_4_productgroup: 'verzekeren',
      page_step: '01',
      form_name: 'schade melden en declareren',
      product_name: 'schade melden en declareren',
      product_category: ["verzekeren"],
      event: 'form_view',
      funnelName: 'schadefrm-verzekeren:schademelden',
      newpageName: '01-schade melden en declareren:schadefrm-verzekeren:schademelden:pm',
      newpage_step_name: '01-schade melden en declareren'
    });
  }

  // phoneNumberToCallMobile moved into view

  public clickDamageCategoryInboedel() {
    aegonTealium({
      page_cat_1_type: 'formulier',
      page_cat_2_name: 'schade melden en declareren',
      page_cat_3_section: 'particulier',
      page_cat_4_productgroup: 'verzekeren',
      page_cat_5_product: 'inboedelverzekering',
      page_step: '02',
      form_name: 'schade melden en declareren',
      product_name: 'inboedelverzekering',
      product_category: ["verzekeren"],
      event: 'form_started',
      funnelName: 'schadefrm-inboedelverzekering:schademelden',
      newpageName: '02-schade melden en declareren:schadefrm-inboedelverzekering:schademelden:pm',
      newpage_step_name: '02-schade melden en declareren'
    });
  }

  public clickDamageCategoryOpstal() {
    aegonTealium({
      page_cat_1_type: 'formulier',
      page_cat_2_name: 'schade melden en declareren',
      page_cat_3_section: 'particulier',
      page_cat_4_productgroup: 'verzekeren',
      page_cat_5_product: 'opstalverzekering',
      page_step: '02',
      form_name: 'schade melden en declareren',
      product_name: 'opstalverzekering',
      product_category: ["verzekeren"],
      event: 'form_started',
      funnelName: 'schadefrm-opstalverzekering:schademelden',
      newpageName: '02-schade melden en declareren:schadefrm-opstalverzekering:schademelden:pm',
      newpage_step_name: '02-schade melden en declareren'
    });
  }

  public clickDamageCategoryAuto() {
    aegonTealium({
      page_cat_1_type: 'formulier',
      page_cat_2_name: 'schade melden en declareren',
      page_cat_3_section: 'particulier',
      page_cat_4_productgroup: 'verzekeren',
      page_cat_5_product: 'autoverzekering',
      page_step: '02',
      form_name: 'schade melden en declareren',
      product_name: 'autoverzekering',
      product_category: ["verzekeren"],
      event: 'form_started',
      funnelName: 'schadefrm-autoverzekering:schademelden',
      newpageName: '02-schade melden en declareren:schadefrm-autoverzekering:schademelden:pm',
      newpage_step_name: '02-schade melden en declareren'
    });
  }

  public clickDamageCategoryAansprakelijkheid() {
    aegonTealium({
      page_cat_1_type: 'formulier',
      page_cat_2_name: 'schade melden en declareren',
      page_cat_3_section: 'particulier',
      page_cat_4_productgroup: 'verzekeren',
      page_cat_5_product: 'aansprakelijkheidsverzekering',
      page_step: '02',
      form_name: 'schade melden en declareren',
      product_name: 'aansprakelijkheidsverzekering',
      product_category: ["verzekeren"],
      event: 'form_started',
      funnelName: 'schadefrm-aansprakelijkheidsverzekering:schademelden',
      newpageName: '02-schade melden en declareren:schadefrm-aansprakelijkheidsverzekering:schademelden:pm',
      newpage_step_name: '02-schade melden en declareren'
    });
  }

  public clickDamageCategoryReis() {
    aegonTealium({
      page_cat_1_type: 'formulier',
      page_cat_2_name: 'schade melden en declareren',
      page_cat_3_section: 'particulier',
      page_cat_4_productgroup: 'verzekeren',
      page_cat_5_product: 'doorlopende reisverzekering',
      page_step: '02',
      form_name: 'schade melden en declareren',
      product_name: 'doorlopende reisverzekering',
      product_category: ["verzekeren"],
      event: 'form_started',
      funnelName: 'schadefrm-doorlopende reisverzekering:schademelden',
      newpageName: '02-schade melden en declareren:schadefrm-doorlopende reisverzekering:schademelden:pm',
      newpage_step_name: '02-schade melden en declareren'
    });
  }

  public endOfFunnelReachedForInboedel() {
    aegonTealium({
      page_cat_1_type: 'formulier',
      page_cat_2_name: 'schade melden en declareren',
      page_cat_3_section: 'particulier',
      page_cat_4_productgroup: 'verzekeren',
      page_cat_5_product: 'inboedelverzekering',
      page_step: '03',
      form_name: 'schade melden en declareren',
      product_name: 'inboedelverzekering',
      product_category: ["verzekeren"],
      event: 'form_completed',
      funnelName: 'schadefrm-inboedelverzekering:schademelden',
      newpageName: '03-schade melden en declareren:schadefrm-inboedelverzekering:schademelden:pm',
      newpage_step_name: '03-schade melden en declareren'
    });
  }

  public endOfFunnelReachedForOpstal() {
    aegonTealium({
      page_cat_1_type: 'formulier',
      page_cat_2_name: 'schade melden en declareren',
      page_cat_3_section: 'particulier',
      page_cat_4_productgroup: 'verzekeren',
      page_cat_5_product: 'opstalverzekering',
      page_step: '03',
      form_name: 'schade melden en declareren',
      product_name: 'opstalverzekering',
      product_category: ["verzekeren"],
      event: 'form_completed',
      funnelName: 'schadefrm-opstalverzekering:schademelden',
      newpageName: '03-schade melden en declareren:schadefrm-opstalverzekering:schademelden:pm',
      newpage_step_name: '03-schade melden en declareren'
    });
  }

  public endOfFunnelReachedForAuto() {
    aegonTealium({
      page_cat_1_type: 'formulier',
      page_cat_2_name: 'schade melden en declareren',
      page_cat_3_section: 'particulier',
      page_cat_4_productgroup: 'verzekeren',
      page_cat_5_product: 'autoverzekering',
      page_step: '03',
      form_name: 'schade melden en declareren',
      product_name: 'autoverzekering',
      product_category: ["verzekeren"],
      event: 'form_completed',
      funnelName: 'schadefrm-autoverzekering:schademelden',
      newpageName: '03-schade melden en declareren:schadefrm-autoverzekering:schademelden:pm',
      newpage_step_name: '03-schade melden en declareren'
    });
  }

  public endOfFunnelReachedForAansprakelijkheid() {
    aegonTealium({
      page_cat_1_type: 'formulier',
      page_cat_2_name: 'schade melden en declareren',
      page_cat_3_section: 'particulier',
      page_cat_4_productgroup: 'verzekeren',
      page_cat_5_product: 'aansprakelijkheidsverzekering',
      page_step: '03',
      form_name: 'schade melden en declareren',
      product_name: 'aansprakelijkheidsverzekering',
      product_category: ["verzekeren"],
      event: 'form_completed',
      funnelName: 'schadefrm-aansprakelijkheidsverzekering:schademelden',
      newpageName: '03-schade melden en declareren:schadefrm-aansprakelijkheidsverzekering:schademelden:pm',
      newpage_step_name: '03-schade melden en declareren'
    });
  }

  public endOfFunnelReachedForReis() {
    aegonTealium({
      page_cat_1_type: 'formulier',
      page_cat_2_name: 'schade melden en declareren',
      page_cat_3_section: 'particulier',
      page_cat_4_productgroup: 'verzekeren',
      page_cat_5_product: 'doorlopende reisverzekering',
      page_step: '03',
      form_name: 'schade melden en declareren',
      product_name: 'doorlopende reisverzekering',
      product_category: ["verzekeren"],
      event: 'form_completed',
      funnelName: 'schadefrm-doorlopende reisverzekering:schademelden',
      newpageName: '03-schade melden en declareren:schadefrm-doorlopende reisverzekering:schademelden:pm',
      newpage_step_name: '03-schade melden en declareren'
    });
  }

  public clickOnPhoneNumberToCallAtEndOfFunnelForInboedel() {
    aegonTealium({
      page_cat_1_type: 'formulier',
      page_cat_2_name: 'schade melden en declareren',
      page_cat_3_section: 'particulier',
      page_cat_4_productgroup: 'verzekeren',
      page_cat_5_product: 'inboedelverzekering',
      form_name: 'schade melden en declareren',
      product_name: 'inboedelverzekering',
      product_category: ["verzekeren"],
      event: 'contact_bellen',
      funnelName: 'schadefrm-verzekeren:schademelden',
      newpageName: 'schadefrm-verzekeren:schademelden:pm'
    });
  }

  public clickOnPhoneNumberToCallAtEndOfFunnelForOpstal() {
    aegonTealium({
      page_cat_1_type: 'formulier',
      page_cat_2_name: 'schade melden en declareren',
      page_cat_3_section: 'particulier',
      page_cat_4_productgroup: 'verzekeren',
      page_cat_5_product: 'opstalverzekering',
      form_name: 'schade melden en declareren',
      product_name: 'opstalverzekering',
      product_category: ["verzekeren"],
      event: 'contact_bellen',
      funnelName: 'schadefrm-verzekeren:schademelden',
      newpageName: 'schadefrm-verzekeren:schademelden:pm'
    });
  }

  public clickOnPhoneNumberToCallAtEndOfFunnelForAuto() {
    aegonTealium({
      page_cat_1_type: 'formulier',
      page_cat_2_name: 'schade melden en declareren',
      page_cat_3_section: 'particulier',
      page_cat_4_productgroup: 'verzekeren',
      page_cat_5_product: 'autoverzekering',
      form_name: 'schade melden en declareren',
      product_name: 'autoverzekering',
      product_category: ["verzekeren"],
      event: 'contact_bellen',
      funnelName: 'schadefrm-verzekeren:schademelden',
      newpageName: 'schadefrm-verzekeren:schademelden:pm'
    });
  }

  public clickOnPhoneNumberToCallAtEndOfFunnelForAansprakelijkheid() {
    aegonTealium({
      page_cat_1_type: 'formulier',
      page_cat_2_name: 'schade melden en declareren',
      page_cat_3_section: 'particulier',
      page_cat_4_productgroup: 'verzekeren',
      page_cat_5_product: 'aansprakelijkheidsverzekering',
      form_name: 'schade melden en declareren',
      product_name: 'aansprakelijkheidsverzekering',
      product_category: ["verzekeren"],
      event: 'contact_bellen',
      funnelName: 'schadefrm-verzekeren:schademelden',
      newpageName: 'schadefrm-verzekeren:schademelden:pm'
    });
  }

  public clickOnPhoneNumberToCallAtEndOfFunnelForReis() {
    aegonTealium({
      page_cat_1_type: 'formulier',
      page_cat_2_name: 'schade melden en declareren',
      page_cat_3_section: 'particulier',
      page_cat_4_productgroup: 'verzekeren',
      page_cat_5_product: 'doorlopende reisverzekering',
      form_name: 'schade melden en declareren',
      product_name: 'doorlopende reisverzekering',
      product_category: ["verzekeren"],
      event: 'contact_bellen',
      funnelName: 'schadefrm-verzekeren:schademelden',
      newpageName: 'schadefrm-verzekeren:schademelden:pm'
    });
  }

}
