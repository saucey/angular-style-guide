(function($) {

  'use strict';

  /**
   * JS code for Aegon Menu
   * @type {Object}
   */
  Drupal.behaviors.aegonMenu = {

    attach: function() {

      $("div.mobile-level3").each(function() {
        $("nav").append(this);
      });

      // Mobile navigation
      $("#openmenu").click(function() {
        if ($(this).attr("id") === "openmenu") {
          $("#st-container").addClass("ss-panel-open");
          $(".container").addClass("ss-container-open");
          $(".mobile-level1").addClass("mm-opened").addClass("mm-subopened");
          $(".mobile-level2").addClass("mm-opened");
          $(".mobile").addClass("tapmenu-open");
          $(".ui-panel-dismiss").addClass("ui-panel-dismiss-open");
          $(this).attr('id', 'closemenu');
        } else if ($(this).attr("id") === "closemenu") {
          $("#st-container").removeClass("ss-panel-open");
          $(".container").removeClass("ss-container-open");
          $(".mobile").removeClass("tapmenu-open");
          $(".ui-panel-dismiss").removeClass("ui-panel-dismiss-open");
          $(this).attr('id', 'openmenu');
        }
      });

      $(".mob-2-item a").click(function() {
        var Third = $(this).attr("id");
        if ($(".mobile-level3").hasClass(Third)) {
          $(this).closest(".cbp-spmenu").addClass("mm-subopened");
          $(".mobile-level3." + Third).addClass("mm-opened");
        }
      });

      // Back
      $(".mm-back").click(function() {
        $(this).closest(".cbp-spmenu").removeClass("mm-opened");
        if ($(this).closest(".cbp-spmenu").hasClass("mobile-level3")) {
          $(".mobile-level2").removeClass("mm-subopened");
        } else if ($(this).closest(".cbp-spmenu").hasClass("mobile-level2")) {
          $(".mobile-level2").addClass("level2-push-right");
          $(".mobile-level1").removeClass("mm-subopened").addClass("mm-opened");
        } else {
          $(".mobile-level1").addClass("mm-subopened");
          $(".mobile-level2").removeClass("level2-push-right").addClass("mm-opened");
        }
      });

      // Terug
      $(".terug").click(function() {
        $(this).closest(".cbp-spmenu").addClass("mm-subopened");
        $(".mobile-level2").addClass("mm-opened");
      });

      $(".ui-panel-dismiss").click(function() {
        $("#st-container").removeClass("ss-panel-open");
        $(".container").removeClass("ss-container-open");
        $(".mobile").removeClass("tapmenu-open");
        $(".mobile-level2").removeClass("level2-push-right");
        $(".ui-panel-dismiss").removeClass("ui-panel-dismiss-open");
        $("#closemenu").attr('id', 'openmenu');
      });

      //Touch move to close
      $(".ui-panel-dismiss").bind("touchmove", this.touchMoveHandler);

      //Swipe Left to Close
      $(".mobile-menu").bind("swipeleft", this.swipLeftHandler);

      $(".home-tab-menu").bind("click", function() {
        if ($("nav.homepage-menu #mobile-level2").length < 1) {
          $("nav.homepage-menu #mobile-level1").removeClass("mm-subopened");
        }
      });
    },

    touchMoveHandler: function () {
      $("#st-container").removeClass("ss-panel-open");
      $(".container").removeClass("ss-container-open");
      $(".mobile").removeClass("tapmenu-open");
      $(".mobile-level2").removeClass("level2-push-right");
      $(".ui-panel-dismiss").removeClass("ui-panel-dismiss-open");
      $("#closemenu").attr('id', 'openmenu');
    },

    swipLeftHandler: function () {
      $("#st-container").removeClass("ss-panel-open");
      $(".container").removeClass("ss-container-open");
      $(".mobile").removeClass("tapmenu-open");
      $(".mobile-level2").removeClass("level2-push-right");
      $(".ui-panel-dismiss").removeClass("ui-panel-dismiss-open");
      $("#closemenu").attr('id', 'openmenu');
    }
  };
}(jQuery));