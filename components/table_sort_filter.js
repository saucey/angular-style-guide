(function(doc, win, $, Drupal) {

  'use strict';

  /**
   * MyDocuments's Drupal script.
   * Add new item to public Drupal object
   */
  Drupal.behaviors.table_sort_filter = {

    attach: function () {

      var table = $('.sortabletable').DataTable({
        "info": true,
        "orderClasses": false,
        "target": '.narrow-td',
        "aoColumns": [
            null,
            null,
            { "sType": "date-eu" },
            null  
        ],
        "ordering": true,
        "responsive": true,
        "pageLength": 5,
        "order": [ 2, 'desc' ]
      });

      $('.dataTables_filter input').attr("placeholder", "Zoeken");

      //Add a div to display a reset button (initially hidden with css)
      $(".dataTables_filter").append("<div class='clear_button'></div>"); 

      $('.dataTables_wrapper .dataTables_filter input').focus(function(){

        //show clear-button if input is not empty
        if($(".dataTables_wrapper .dataTables_filter > input").attr("value") === ''){
            $(".clear_button").hide();
        } else {
            $(".clear_button").show();
        }
      });

      $('.docs-show-all').on('click', function(){ 
        if($(this).hasClass('changed')) {
          $(this).removeClass('changed');
          table.page.len(5).draw();
        } else {
          $('.docs-show-all').toggleClass('changed');
          table.page.len(-1).draw();
        }
      });

       $('.clear_button').on('click', function(){ 
       $('.dataTables_wrapper .dataTables_filter input').val('');
        $('.dataTables_wrapper .dataTables_filter input').trigger('keyup.DT');
        $(".clear_button").hide();
      });

    },

    sortTable: function (table_class, div_class, sortDefColumn) {

          var table = $(table_class).DataTable({
         "info": true,
        "orderClasses": false,
        "target": '.narrow-td',
        "aoColumns": [
            null,
            null,
            { "sType": "date-eu" },
            null  
        ],
        "ordering": true,
        "responsive": true,
        "pageLength": 5,
        "order": [ sortDefColumn, 'desc' ]
      }    
    );
  var wrapperId = $(table_class).attr('id')+'_wrapper';
  
  $('#' + wrapperId + ' .dataTables_filter input').attr("placeholder", "Zoeken");
   
  //Add a div to display a reset button (initially hidden with css)
    $('#' + wrapperId + ' .dataTables_filter').append("<div class='clear_button'></div>"); 
  
    $('#' + wrapperId + ' .dataTables_filter input').focus(function(){

        //show clear-button if input is not empty
        if($("#" + wrapperId + " .dataTables_filter > input").attr("value") === ''){
            $("#" + wrapperId + " .clear_button").hide();
        } else {
            $("#" + wrapperId + " .clear_button").show();
        }
      });
    
    $('#' + wrapperId + ' .clear_button').on('click', function(){ 
       $('#' + wrapperId + ' .dataTables_filter input').val('');
      $('#' + wrapperId + ' .dataTables_filter input').trigger('keyup.DT');
      $('#' + wrapperId + ' .clear_button').hide();
    });
    
    $(div_class).on('click', function(){ 
        if($(this).hasClass('changed')) {
          $(this).removeClass('changed');
          table.page.len(5).draw();
        } else {
          $(div_class).toggleClass('changed');
          table.page.len(-1).draw();
        }
      });


    }


  };

})(this.document, this, this.jQuery, this.Drupal);

