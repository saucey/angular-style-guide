/**
 * Copy of the anchors of the situation element to a mobile element
 */
(function() {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.quickquote = {
    attach: function() {
      Drupal.behaviors.slider.activate("#amount-slider","#amount-input",500,0,5000,100,"€");
      Drupal.behaviors.slider.activate("#time-slider","#time-input",10,0,30,1,"");      
    }
  };
})(); 