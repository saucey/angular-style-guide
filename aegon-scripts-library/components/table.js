(function(doc, win, $, Drupal) {

  'use strict';

  /**
   * MyDocuments's Drupal script.
   * Add new item to public Drupal object
   */
  Drupal.behaviors.table = {

    attach: function () {
      // Only in the new theme! Things will break in the old theme.
      if (Drupal.settings.current_theme === 'aegon_theme') {
        this.createTable('.tableDemo');
        this.createTable('.resp_cust_tables', {
          info: false,
          paging: false,
          fnInitComplete: null,
          ordering: false,
          order: [],
          searching: false,
          aoColumns: null,
          bFilter: false
        });
      }
    },

    createTable: function(table_class, options) {

      var defaults = {
        info: true,
        orderClasses: false,
        oLanguage: {
          sInfo: "_END_ van _TOTAL_ documenten",
          sInfoEmpty: "Geen resultaten gevonden",
          sInfoFiltered: ""
        },
        sDom: 'ifrtlp',
        bFilter: true,
        aoColumns: [
            null,
            null,
            { sType: "date-eu" },
            null
        ],
        ordering: true,
        responsive: true,
        pageLength: 5,
        order: [ 2, 'desc' ],
        fnInitComplete: function(oSettings) {
          var that = $(this),
              api = this.api(),
              thatID = that.attr('id');

            if(oSettings.fnRecordsTotal() > 5) {

              // Create show all button
              that.after('<div class="show-all" id="showAll_'+ thatID +'"></div>');

              var showAllBtn = that.parent().find('.show-all');

              showAllBtn.on('click', function(){
                $(this).hasClass('changed') ? api.page.len(5).draw() : api.page.len(-1).draw();
                $(this).toggleClass('changed');
              });

              $(table_class).on( 'search.dt', function () {
                if(api.page.info().recordsDisplay <= 5) {
                   showAllBtn.hide();
                } else {
                   showAllBtn.show();
                }
              });
            }

          // Set placeholder and id for searchbox
          that.parent().find('.dataTables_filter input').attr("placeholder", "Zoeken").attr('id', 'search_'+ thatID);
        }
      };

      var settings = $.extend({}, defaults, options);

      // Init table
      $(table_class).DataTable(settings);

    }

  };

})(this.document, this, this.jQuery, this.Drupal);

