// /**
//  * jQuery UI Slider. This function is being commented out because the slider should be made generic from /components/quickquote-lijfrente.js
//  */
// (function($) {
//   'use strict';

//   // Add new item to public Drupal object
//   Drupal.behaviors.slider = {
//     activate: function(sliderClass,inputClass,sliderValue,sliderMin,sliderMax,sliderStep,Currenty) {
//       Drupal.behaviors.tooltip.activate(".quickquote");
//       $(sliderClass).slider({
//         range: "max",
//         value:sliderValue,
//         min: sliderMin,
//         max: sliderMax,
//         step: sliderStep,
//         slide: function( event, ui ) {
//           $(inputClass).val( Currenty + ui.value );
//           console.log("I'm changed");
//           Drupal.behaviors.quickquote.lijfrenteCalculation(3.05, 35000, 5, "#payment-calculated", "#interest-calculated", "€");
//         }
//       });
//       $(inputClass).val( Currenty + $(sliderClass).slider("value"));
//       $(inputClass).keyup(function() {
//         $(sliderClass).slider("value" , $(this).val().replace(Currenty, ''));
//       });
//     }
//   };
// })(jQuery); 