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
      page_cat_4_productgroup: 'inkomensverzekeringen',
      page_cat_5_product: 'arbeidsongeschiktheidspensioen',
      page_step: '01',
      product_name: 'arbeidsongeschiktheidspensioen',
      product_category: ["inkomensverzekeringen"],
      event: 'qq_view',
      funnelName: 'qq-arbeidsongeschiktheidspensioen:inkomensverzekeringen',
      newpageName: '01-uw inkomen bij arbeidsongeschikth eid:qq-arbeidsongeschiktheidspensioen:inkomensverzekeringen:pm',
      newpage_step_name: '01-uw inkomen bijarbeidsongeschiktheid'
    });
  }

  public wiaFirstInteractionWithTool() {
    aegonTealium({
      page_cat_1_type: 'quick_quotes',
      page_cat_2_name: 'uw inkomen bij arbeidsongeschikthe id',
      page_cat_3_section: 'zakelijk',
      page_cat_4_productgroup: 'inkomensverzekeringen',
      page_cat_5_product: 'arbeidsongeschiktheidspensioen',
      page_step: '02',
      product_name: 'arbeidsongeschiktheidspensioen',
      product_category: ["inkomensverzekeringen"],
      event: 'qq_start',
      funnelName: 'qq-arbeidsongeschiktheidspensioen:inkomensverzekeringen',
      newpageName: '02-uw inkomen bijarbeidsongeschiktheid:qq-arbeidsongeschiktheidspensioen:nkomensverzekeringen:pm',
      newpage_step_name: '02-uw inkomen bijarbeidsongeschiktheid'
    });
  }

  public wiaToolResultPresented() {
    aegonTealium({
      page_cat_1_type: 'quick_quotes',
      page_cat_2_name: 'uw inkomen bij arbeidsongeschikthe id',
      page_cat_3_section: 'zakelijk',
      page_cat_4_productgroup: 'inkomensverzekeringen',
      page_cat_5_product: 'arbeidsongeschiktheidspensioen',
      page_step: '03',
      product_name: 'arbeidsongeschiktheidspensioen',
      product_category: ["inkomensverzekeringen"],
      event: 'qq_completed',
      funnelName: 'qq-arbeidsongeschiktheidspensioen:inkomensverzekeringen',
      newpageName: '03-uw inkomen bijarbeidsongeschiktheid:qq-arbeidsongeschiktheidspensioen:inkomensverzekeringen:pm',
      newpage_step_name: '02-uw inkomen bijarbeidsongeschiktheid'
    });
  }

  public wiaClickOnSymbolIcon(title: string, imageName: string) {
    aegonTealium({
      page_cat_1_type: 'product',
      page_cat_2_name: 'uw inkomen bij arbeidsongeschikthe id',
      page_cat_3_section: 'zakelijk',
      page_cat_4_productgroup: 'inkomensverzekeringen',
      page_cat_5_product: 'arbeidsongeschiktheidspensioen',
      product_name: 'arbeidsongeschiktheidspensioen',
      product_category: ["inkomensverzekeringen"],
      event: 'expand',
      expand_action: 'icon click',
      funnelName: 'qq-arbeidsongeschiktheidspensioen:inkomensverzekeringen',
      newpageName: 'qq-arbeidsongeschiktheidspensioen:inkomensverzekeringen:pm',
      info_name: imageName + ':' + title
    });
  }

  public wiaClickOnReadMore(title: string, imageName: string) {
    aegonTealium({
      page_cat_1_type: 'product',
      page_cat_2_name: 'uw inkomen bij arbeidsongeschikthe id',
      page_cat_3_section: 'zakelijk',
      page_cat_4_productgroup: 'inkomensverzekeringen',
      page_cat_5_product: 'arbeidsongeschiktheidspensioen',
      product_name: 'arbeidsongeschiktheidspensioen',
      product_category: ["inkomensverzekeringen"],
      event: 'expand',
      expand_action: 'read more',
      funnelName: 'qq-arbeidsongeschiktheidspensioen:inkomensverzekeringen',
      newpageName: 'qq-arbeidsongeschiktheidspensioen:inkomensverzekeringen:pm',
      info_name: imageName + ':' + title
    });
  }

  public wiaClickToDownloadDocumentWerkplan() {
    aegonTealium({
      page_cat_1_type: 'product',
      page_cat_2_name: 'uw inkomen bij arbeidsongeschikthe id',
      page_cat_3_section: 'zakelijk',
      page_cat_4_productgroup: 'inkomensverzekeringen',
      page_cat_5_product: 'arbeidsongeschiktheidspensioen',
      product_name: 'arbeidsongeschiktheidspensioen',
      product_category: ["inkomensverzekeringen"],
      event: 'download',
      download_filename: 'voorwaarden aegon gezond werkplan',
      funnelName: 'qq-arbeidsongeschiktheidspensioen:inkomensverzekeringen',
      newpageName: 'qq-arbeidsongeschiktheidspensioen:inkomensverzekeringen:pm'
    });
  }

  public wiaClickToDownloadDocumentSchade() {
    aegonTealium({
      page_cat_1_type: 'product',
      page_cat_2_name: 'uw inkomen bij arbeidsongeschikthe id',
      page_cat_3_section: 'zakelijk',
      page_cat_4_productgroup: 'inkomensverzekeringen',
      page_cat_5_product: 'arbeidsongeschiktheidspensioen',
      product_name: 'arbeidsongeschiktheidspensioen',
      product_category: ["inkomensverzekeringen"],
      event: 'download',
      download_filename: 'pensioenreglement schade',
      funnelName: 'qq-arbeidsongeschiktheidspensioen:inkomensverzekeringen',
      newpageName: 'qq-arbeidsongeschiktheidspensioen:inkomensverzekeringen:pm'
    });
  }
}
