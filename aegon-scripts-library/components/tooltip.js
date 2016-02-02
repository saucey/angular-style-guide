/**
 * Example JavaScript component
 */
// Closure with jQuery support
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.tooltip = {
    attach: function () {
      this.attached = true;  //used to determine if this function has already run
    },
    attached: false,
    activate: function (selector, pos) {

      var isTouch = "ontouchstart" in window || navigator.msMaxTouchPoints,
      openTooltip = function(ele, pos){
        var $this = ele,
            $title = $this.attr('title'),
            $touch = $this.attr('data-touch') === "true" ? true : false,
            $pos = $this.attr('data-pos'),
            posRE = new RegExp(/^(top|bottom|left|right)$/);
        
        if ($title && $title !== " " && $title.length > 0) { //the temporary content has 2B " ", since "" will set display to "none" according to stylesheet definition, 
          $(".help.dialog").remove();
          // if the element has the attr data-pos
          if($pos !== 'undefined' && posRE.test($pos)){
            pos = $pos;
          }else
          // if pos is not set or it's not a valid position, defaults to bottom
          if(typeof pos === 'undefined' || ! posRE.test(pos)){
            pos = 'bottom';
          }

          var dialog = document.createElement("DIV");
          dialog.className = "help dialog " + pos;
          dialog.innerHTML = $title;

          $this.attr('title', ' ');

          $(selector).append(dialog); //this has 2 happen b4 measurements of dialog are taken, otherwise they won't be initialized
          var $dialog = $(dialog),
              offset = $this.offset();

          switch(pos){
            case 'top':
              offset.top = offset.top - $dialog.outerHeight() - 20;
              offset.left = offset.left - $dialog.outerWidth() / 2;            
            break;
            case 'left':
              offset.top = offset.top - $dialog.outerHeight() / 2;
              offset.left = offset.left - $dialog.outerWidth() - 5;            
            break;
            case 'right':
              offset.top = offset.top - $dialog.outerHeight() / 2;
              offset.left = offset.left + 25;            
            break;
            default:
              // default is bottom 
              offset.top = offset.top + $this.outerHeight() + 20;
              offset.left = offset.left - $dialog.outerWidth() / 2;            
          }
          
          $dialog.offset(offset);

          $(document).click(function () {
            $this.attr('title', dialog.innerHTML);
            $(".dialog").remove();
          });

          $this.on('mouseleave', function(){
            $this.attr('title', dialog.innerHTML);
            $dialog.remove();
          });

          if (isTouch && $touch){
            $this.on('click', function (e) {
              e.stopPropagation();
              $this.attr('title', dialog.innerHTML);
              $dialog.remove();
            });      
          }        
        }
      };

      $(selector + " .help").on('mouseenter', function () {
        openTooltip($(this), pos);
      });

      // touch event
      if (isTouch){
        $(selector + ' .help[data-touch="true"]').on('click', function () {
            openTooltip($(this), pos);
        });      
      }
    },
  };
})(jQuery);
