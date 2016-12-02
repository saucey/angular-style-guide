import { Injectable } from "@angular/core";
import { aegonTealium } from "../../../lib/aegon_tealium";
/**
 * WIATealiumService created on 12/2/16 9:56 AM.
 *
 * @description WIA wrapper for Tealium API
 * @author Florian Popa <florian@webgenerals.com>
 */

@Injectable()
export class WIATealiumService {

  public wiaToolLoaded() {
    aegonTealium({
      page_cat_1_type: 'quick_quotes',
      page_cat_2_name: 'uw inkomen bij arbeidsongeschikthe id',
      page_cat_3_section: 'zakelijk',
      page_cat_4_productgroup: 'nkomensverzekeringen',
      page_cat_5_product: 'aov',
      page_step: '01',
      product_name: ["aov"],
      product_category: ["inkomensverzekeringen"],
      event: 'qq_view',
    });
  }

  public wiaFirstInteractionWithTool() {
    aegonTealium({
      page_cat_1_type: 'quick_quotes',
      page_cat_2_name: 'uw inkomen bij arbeidsongeschikthe id',
      page_cat_3_section: 'zakelijk',
      page_cat_4_productgroup: 'nkomensverzekeringen',
      page_cat_5_product: 'aov',
      page_step: '02',
      product_name: ["aov"],
      product_category: ["inkomensverzekeringen"],
      event: 'qq_start',
    });
  }

  public wiaToolResultPresented() {
    aegonTealium({
      page_cat_1_type: 'quick_quotes',
      page_cat_2_name: 'uw inkomen bij arbeidsongeschikthe id',
      page_cat_3_section: 'zakelijk',
      page_cat_4_productgroup: 'nkomensverzekeringen',
      page_cat_5_product: 'aov',
      page_step: '03',
      product_name: ["aov"],
      product_category: ["inkomensverzekeringen"],
      event: 'qq_completed',
    });
  }

  public wiaClickOnSymbolIcon() {
    aegonTealium({
      page_cat_1_type: 'product',
      page_cat_2_name: 'uw inkomen bij arbeidsongeschikthe id',
      page_cat_3_section: 'zakelijk',
      page_cat_4_productgroup: 'nkomensverzekeringen',
      page_cat_5_product: 'aov',
      product_name: ["aov"],
      product_category: ["inkomensverzekeringen"],
      event: 'expand',
      expand_action: 'icon click'
    });
  }

  public wiaClickOnReadMore() {
    aegonTealium({
      page_cat_1_type: 'product',
      page_cat_2_name: 'uw inkomen bij arbeidsongeschikthe id',
      page_cat_3_section: 'zakelijk',
      page_cat_4_productgroup: 'nkomensverzekeringen',
      page_cat_5_product: 'aov',
      product_name: ["aov"],
      product_category: ["inkomensverzekeringen"],
      event: 'expand',
      expand_action: 'read more'
    });
  }

  public wiaClickToDownloadDocumentWerkplan() {
    aegonTealium({
      page_cat_1_type: 'product',
      page_cat_2_name: 'uw inkomen bij arbeidsongeschikthe id',
      page_cat_3_section: 'zakelijk',
      page_cat_4_productgroup: 'nkomensverzekeringen',
      page_cat_5_product: 'aov',
      product_name: ["aov"],
      product_category: ["inkomensverzekeringen"],
      event: 'download',
      download_filename: 'voorwaarden aegon gezond werkplan',
    });
  }

  public wiaClickToDownloadDocumentSchade() {
    aegonTealium({
      page_cat_1_type: 'product',
      page_cat_2_name: 'uw inkomen bij arbeidsongeschikthe id',
      page_cat_3_section: 'zakelijk',
      page_cat_4_productgroup: 'nkomensverzekeringen',
      page_cat_5_product: 'aov',
      product_name: ["aov"],
      product_category: ["inkomensverzekeringen"],
      event: 'download',
      download_filename: 'pensioenreglement schade',
    });
  }
}
