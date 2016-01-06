(function(doc, win, $, Drupal) {

  'use strict';

  /**
   * MyDocuments's Drupal script.
   * Add new item to public Drupal object
   */
  Drupal.behaviors.table = {

    attach: function () {
      this.createTable('#tableDemos', {ordering: false, info: false, bFilter: false});
    },

    createTable: function(table_class, options) {

      var defaults = {
        info: true,
        orderClasses: false,
        oLanguage: {
          sInfo: "_END_ van _TOTAL_ documenten",
          sInfoEmpty: "Geen resultaten gevonden",
          sInfoFiltered: "",
        },
        sDom: '<"top"<"left"i><"right"f>>rtlp',
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
              api = this.api();

            if(oSettings.fnRecordsTotal() > 5) {

              // Create show all button
              that.after('<div class="show-all"></div>');

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

          // Set placeholder for searchbox 
          that.parent().find('.dataTables_filter input').attr("placeholder", "Zoeken");
        }
      };

      var settings = $.extend({}, defaults, options);

      // Init table
      $(table_class).DataTable(settings); 

    }

  };

})(this.document, this, this.jQuery, this.Drupal);
