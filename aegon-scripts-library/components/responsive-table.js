(function(doc, win, $, Drupal) {

  'use strict';

  /**
   * MyDocuments's Drupal script.
   * Add new item to public Drupal object
   */
  Drupal.behaviors.responsiveTable = {
    attach: function () {
      this.attached = true;  //used to determine if this function has already run
    },
    attached: false,
    activate: function(selector) {
      var $resp_tables = $(selector + ' table'),
        $this = this;

      $resp_tables.each(function(i){
        $this.createToggleButton($resp_tables[i]); /* creating table menu - calling function */
      });

      $this.checkWindowSize($resp_tables);
      // window resize event
      $(window).resize(function () {
        $this.checkWindowSize($resp_tables);
      });
    },
    checkWindowSize: function($resp_tables){
      var wi = $(window).width(),
        mobile = true,
        tablet = true,
        desktop = true,
        bigscreen = true,
        $this = this;
      if (wi <= 640) {
        if (mobile) {
          $resp_tables.each(function(i){
            $this.showTwoTableCol($resp_tables[i]);
          });
          mobile = false;
          tablet = true;
          desktop = true;
          bigscreen = true;
        }
      }
      else if ((wi > 640) && (wi <= 900)) {
        if (tablet) {
          $resp_tables.each(function(i){
            $this.showThreeTableCol($resp_tables[i]);
          });
          mobile = true;
          tablet = false;
          desktop = true;
          bigscreen = true;
        }
      }
      else if ((wi > 900) && (wi <= 1023)) {
        if (desktop) {          
          $resp_tables.each(function(i){
            $this.showFourTableCol($resp_tables[i]);
          });
          mobile = true;
          tablet = true;
          desktop = false;
          bigscreen = true;
        }
      }
      else if (wi > 1023) {
        if (bigscreen) {
          $resp_tables.each(function(i){
            $this.showAlltableCol($resp_tables[i]);
          });
          mobile = true;
          tablet = true;
          desktop = true;
          bigscreen = false;
        }
      }
    },
    /* Function for Creating tablemenu */
    createToggleButton: function(element) {
      var $thValues = $(element).find("th");
      var $thText = [];
      if ($(element).attr('align') === 'right') {
        $(element).addClass('table-right');
      }
      else if ($(element).attr('align') === 'left') {
        $(element).addClass('table-left');
      }
      if ($thValues.length > 1) {
        if ($(element).hasClass("fonds-table")) {
          for (var t = 1; t < $thValues.length - 1; t++) {
            $thText.push(t + "+" + $($thValues[t]).text()); /* Getting th values */
          }
        } 
        else {
          for (var t2 = 1; t2 < $thValues.length; t2++) {
            $thText.push(t2 + "+" + $($thValues[t2]).text()); /* Getting th values */
          }
        }
        var div = $('<div/>').attr('class', 'table-menu-wrapper');
        var styles1 = $(element).attr('style');
        if (styles1) {
          var stylesAttr = styles1.split(';');
          var stylesAttrlen = styles1.split(';').length;
          for (var s = 0; s < stylesAttrlen; s++) {
            var ppty = stylesAttr[s].split(':');
            if ((ppty[0].search('width') !== -1) && ((ppty[0].search('min-width') > -1) && (ppty[0].search('max-width') > -1))) {
              if ($(element).attr('align') !== 'right') {
                div.attr('style', 'width:' + ppty[1]); /* Setting width for wrapper div based on table width*/
              }
            }
          }
        }

        var a = $('<a/>').attr('class', 'table-menu-btn button').attr('href', '#').text('Kolom opties');
        var ul = $('<ul/>').hide().addClass('table-menu');
        var div1 = $('<div/>').attr('class', 'table-wrapper responsive-table');
        var div2 = $('<div/>').attr('class', 'table-container');

        /* placing created elements in page */
        $(element).wrap(div1);
        $(element).before(div);
        $(div).append(a);
        $(a).after(ul);
        $(element).wrap(div2);

        for (var l = 0; l < $thText.length; l++) {
          var colIndex = $thText[l].split('+')[0];
          var colText = $thText[l].split('+')[1];
          var liele = "<li><label class='checkbox'><input type='checkbox' value='" + colIndex + "' checked/><span class='checkbox'></span>" + colText + "</label></li>";
          $(ul).append(liele);
        }

        $(element).closest('.table-wrapper').find("a.table-menu-btn").click(function (e) {
          e.preventDefault();
          var ulHereFlag = ($(this).parent().find("ul.table-menu").css('display') === 'none');
          $("ul.table-menu").hide();
          if (ulHereFlag) {
            $(this).parent().find("ul.table-menu").show();
          }
        });
        $(element).closest('.table-wrapper').find(":checkbox").change(function () {
          var value = parseInt($(this).val()) + 1;
          if (!($(this).is(':checked'))) {
            $(element).find('td:nth-child(' + value + '),th:nth-child(' + value + ')').hide();
          }
          else {
            $(element).find('td:nth-child(' + value + '),th:nth-child(' + value + ')').show();
          }
        });
      }

      $('body').bind("click touchstart", function (event) {
        var $target = $(event.target);
        if (!($target.is("ul.table-menu") || $target.is("a.table-menu-btn") || $target.parents().is("ul.table-menu"))) {
          $('ul.table-menu').hide();
        }
      });
    },
    showHideFondsFavCol: function(element, act) {
      var $thValues = $(element).find("th");
      if (act === 'show') {
        $(element).find('td:nth-child(' + $thValues.length + '),th:nth-child(' + $thValues.length + ')').show();
      }
      else if (act === 'hide') {
        $(element).find('td:nth-child(' + $thValues.length + '),th:nth-child(' + $thValues.length + ')').hide();
      }
    },

    showTwoTableCol: function(element) {
      this.showAlltableCol(element);
      var $chkboxes = $(element).closest('.table-wrapper').find(":checkbox");
      var $checkedBoxes = [];
      for (var c = 0; c < $chkboxes.length; c++) {
        if ($($chkboxes[c]).is(':checked')) {
          $checkedBoxes.push(c);
        }
      }
      if ($checkedBoxes.length > 1) {
        for (var d = 1; d < $checkedBoxes.length; d++) {
          $($chkboxes[$checkedBoxes[d]]).click();
        }
      }
      if ($(element).hasClass("fonds-table")) {
        this.showHideFondsFavCol(element, 'hide');
      }
    },

    showThreeTableCol: function (element) {
      this.showAlltableCol(element);
      var $chkboxes = $(element).closest('.table-wrapper').find(":checkbox");
      var $checkedBoxes = [];
      for (var c = 0; c < $chkboxes.length; c++) {
        if ($($chkboxes[c]).is(':checked')) {
          $checkedBoxes.push(c);
        }
      }
      if ($checkedBoxes.length > 2) {
        for (var d = 2; d < $checkedBoxes.length; d++) {
          $($chkboxes[$checkedBoxes[d]]).click();
        }
      }
      if ($(element).hasClass("fonds-table")) {
        this.showHideFondsFavCol(element, 'hide');
      }
    },

    showFourTableCol: function(element) {
      this.showAlltableCol(element);
      var $chkboxes = $(element).closest('.table-wrapper').find(":checkbox");
      var $checkedBoxes = [];
      for (var c = 0; c < $chkboxes.length; c++) {
        if ($($chkboxes[c]).is(':checked')) {
          $checkedBoxes.push(c);
        }
      }
      if ($checkedBoxes.length > 3) {
        for (var d = 3; d < $checkedBoxes.length; d++) {
          $($chkboxes[$checkedBoxes[d]]).click();
        }
      }
      if ($(element).hasClass("fonds-table")) {
        this.showHideFondsFavCol(element, 'hide');
      }
    },

    showAlltableCol: function(element) {
      var $chkboxes = $(element).closest('.table-wrapper').find(":checkbox");
      for (var e = 0; e < $chkboxes.length; e++) {
        if (!($($chkboxes[e]).is(':checked'))) {
          $($chkboxes[e]).click();
        }
      }
      if ($(element).hasClass("fonds-table")) {
        this.showHideFondsFavCol(element, 'show');
      }
    }
  };

})(this.document, this, this.jQuery, this.Drupal);

