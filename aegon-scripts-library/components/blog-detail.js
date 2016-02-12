/**
 * Blog form validatoin
 */

 (function($) {
   'use strict';

   // Add new item to public Drupal object
   Drupal.behaviors.blog = {
     attach: function () {
       var reaction = $("#comment-form");
       reaction.validVal({
         form: {
           onInvalid: function() {
           reaction.find($(".error")).show();
       }
     }


     });

     }
   };


 })(jQuery);
