import { Injectable } from "@angular/core";
import { aegonTealium } from "../../../../lib/aegon_tealium";
/**
 * FNOLRepairshopTealiumService created on 12/12/16 3:56 PM.
 *
 * @description FNOL repairshop wrapper for Tealium API
 * @author Florian Popa <florian@webgenerals.com>
 */

@Injectable()
export class FNOLRepairshopTealiumService {

  public toolLoaded() {
    aegonTealium({
      page_cat_1_type: 'formulier',
      page_cat_2_name: 'schadehersteller zoeken',
      page_cat_3_section: 'particulier',
      page_cat_4_productgroup: 'verzekeren',
      page_cat_5_product: 'autoverzekering',
      page_step: '01',
      form_name: 'schadehersteller zoeken',
      product_name: 'autoverzekering',
      product_category: ["verzekeren"],
      event: 'form_view',
      funnelName: 'schadefrm-autoverzekering:schadehersteller zoeken',
      newpageName: '01-schadehersteller zoeken:schadefrm-autoverzekering:schadehersteller zoeken:pm',
      newpage_step_name: '01-schadehersteller zoeken'
    });
  }

  public firstInteractionWithTool() {
    aegonTealium({
      page_cat_1_type: 'formulier',
      page_cat_2_name: 'schadehersteller zoeken',
      page_cat_3_section: 'particulier',
      page_cat_4_productgroup: 'verzekeren',
      page_cat_5_product: 'autoverzekering',
      page_step: '02',
      form_name: 'schadehersteller zoeken',
      product_name: 'autoverzekering',
      product_category: ["verzekeren"],
      event: 'form_started',
      funnelName: 'schadefrm-autoverzekering:schadehersteller zoeken',
      newpageName: '02-schadehersteller zoeken:schadefrm-autoverzekering:schadehersteller zoeken:pm',
      newpage_step_name: '02-schadehersteller zoeken'
    });
  }

  public searchPerformed() {
    aegonTealium({
      page_cat_1_type: 'formulier',
      page_cat_2_name: 'schadehersteller zoeken',
      page_cat_3_section: 'particulier',
      page_cat_4_productgroup: 'verzekeren',
      page_cat_5_product: 'autoverzekering',
      page_step: '03',
      form_name: 'schadehersteller zoeken',
      product_name: 'autoverzekering',
      product_category: ["verzekeren"],
      event: 'form_completed',
      funnelName: 'schadefrm-autoverzekering:schadehersteller zoeken',
      newpageName: '03-schadehersteller zoeken:schadefrm-autoverzekering:schadehersteller zoeken:pm',
      newpage_step_name: '03-schadehersteller zoeken'
    });
  }

  public clickOnWebsiteLinkForSearchResult() {
    aegonTealium({
      page_cat_1_type: 'formulier',
      page_cat_2_name: 'schadehersteller zoeken',
      page_cat_3_section: 'particulier',
      page_cat_4_productgroup: 'verzekeren',
      page_cat_5_product: 'autoverzekering',
      form_name: 'schadehersteller zoeken',
      product_name: 'autoverzekering',
      product_category: ["verzekeren"],
      event: 'contact_website',
      funnelName: 'schadefrm-autoverzekering:schadehersteller zoeken',
      newpageName: 'schadefrm-autoverzekering:schadehersteller zoeken:pm',
    });
  }

  public clickOnLocationIconForSearchResult() {
    aegonTealium({
      page_cat_1_type: 'formulier',
      page_cat_2_name: 'schadehersteller zoeken',
      page_cat_3_section: 'particulier',
      page_cat_4_productgroup: 'verzekeren',
      page_cat_5_product: 'autoverzekering',
      form_name: 'schadehersteller zoeken',
      product_name: 'autoverzekering',
      product_category: ["verzekeren"],
      event: 'contact_locatie',
      funnelName: 'schadefrm-autoverzekering:schadehersteller zoeken',
      newpageName: 'schadefrm-autoverzekering:schadehersteller zoeken:pm',
    });
  }

}
