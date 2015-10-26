/**
 * Demo Settings for eu_cookie_compliance Drupal module
 * @param  {[type]} $ [description]
 * @return {[type]}   [description]
 */
(function($) {
  'use strict';

  $.extend(Drupal.settings, {
    eu_cookie_compliance: {
      popup_enabled: 1,
      popup_agreed_enabled: 0,
      popup_hide_agreed: 0,
      popup_clicking_confirmation: 0,
      popup_html_info: '<div>\n  <div class ="popup-content info">\n    <div id="popup-text">\n      <div class="cookie-opt-in"><a class="btn-close" href="javascript:void(0);" id="no-thankx">sluiten</a>\n<p>Aegon maakt gebruik van cookies voor een goede werking van de site, voor <strong>tracking</strong> en voor het bijhouden van de <strong>statistieken</strong>. Gaat u verder op de site? Dan stemt u er in toe dat wij cookies voor plaatsen. Wilt u niet alle cookies accepteren, wijzig dan uw keuze via <a class="find-more-button" href="javascript:void(0);">instellingen</a>. Voor meer informatie verwijzen wij u naar het <a href="/overaegon/privacy/">privacy en cookiebestand</a>.</p>\n</div>\n<div id="popup-wrapper" style="position: fixed;top: -9999px;"> </div>\n    </div>\n    <div id="popup-buttons">\n      <button type="button" class="agree-button">cookies toestaan</button>\n      <button type="button" class="find-more-button">instellingen</button>\n    </div>\n  </div>\n</div>\n',
      popup_height: "auto",
      popup_width: "100%",
      popup_delay: 1e3,
      popup_link: "/aegon.nl/privacy.html",
      popup_link_new_window: 1,
      popup_position: 1,
      popup_language: "en",
      domain: "aegon.loc"
    }
  });

})(jQuery);
