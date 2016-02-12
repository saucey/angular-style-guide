/**
 * Comment form validatoin
 */

 (function($) {
   'use strict';

   // Add new item to public Drupal object
   Drupal.behaviors.comment_form = {
     attach: function () {
       var reaction = $("#comment-form");
       reaction.validVal({
         form: {
           onInvalid: function() {
            reaction.find($(".error")).show();
           },
           onValid: function() {
             reaction.find($(".error")).hide();
           }
         }
     });

     }
   };


 })(jQuery);
