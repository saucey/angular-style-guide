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
            $title = $this.attr('data-title') !== undefined ? $this.attr('data-title') : $this.attr('title'),
            $pos = $this.attr('data-pos'),
            posRE = new RegExp(/^(top|bottom|left|right)$/);

        if ($title && $title !== " ") {
          // add the right attribute if it doesn't have it
          if($this.attr('data-title') === undefined) {
            $this.attr('title', '');
            $this.attr('data-title', $title);
          }

          // remove the dialog if it's open
          $(".help.dialog").remove();

          // if the element has the attr data-pos
          if($pos !== undefined && posRE.test($pos)){
            pos = $pos;
          }else
          // if pos is not set or it's not a valid position, defaults to bottom
          if(typeof pos === undefined || ! posRE.test(pos)){
            pos = 'bottom';
          }

          var dialog = document.createElement("DIV");
          dialog.className = "help dialog " + pos;
          var caret = document.createElement("DIV");
          caret.className = "caret";
          var content = document.createTextNode($title);
          dialog.appendChild(caret);
          dialog.appendChild(content);

          $this.attr('data-title', '');

          $(selector).append(dialog); //this has 2 happen b4 measurements of dialog are taken, otherwise they won't be initialized
          var $dialog = $(dialog),
              offset = $this.offset(),
              elOffset = {},
              caretPos = {};

          switch(pos){
            case 'top':
              elOffset.top = offset.top - $dialog.outerHeight() - 20;
              elOffset.left = offset.left - $dialog.outerWidth() / 2;
            break;
            case 'left':
              elOffset.top = offset.top - $dialog.outerHeight() / 2;
              elOffset.left = offset.left - $dialog.outerWidth() - 5;            
            break;
            case 'right':
              elOffset.top = offset.top - $dialog.outerHeight() / 2;
              elOffset.left = offset.left + 25;            
            break;
            default:
              // default is bottom 
              elOffset.top = offset.top + $this.outerHeight() + 20;
              elOffset.left = offset.left - $dialog.outerWidth() / 2;
          }
          
          $dialog.offset(elOffset);

          // for the position of the caret 
          switch(pos){
            case 'left':
            case 'right':
              caretPos.top = offset.top - $dialog.offset().top;            
            break;
            default:
              // default is bottom and top
              caretPos.left = offset.left - $dialog.offset().left;
          } 

          $dialog.find('.caret').css(caretPos);

          // removes the dialog on mouseleave only
          $this.on('mouseleave', function(){
            $dialog.find('.caret').remove();
            $this.attr('data-title', dialog.innerHTML);
            $dialog.remove();
          });

          // if it's touch removes the dialog on document click only
          if (isTouch){
            $(document).on('click', function (e) {
              e.stopPropagation();
              $dialog.find('.caret').remove();
              $this.attr('data-title', dialog.innerHTML);
              $(".dialog").remove();
            });
          }        
        }
      };
      // initial scan for help items to hide them 
      // if they don't have either data-title or title
      if($(selector).find(".help").length > 0){
        $(selector).find(".help").each(function(){
          var $helpEle = $(this),
            $title = ($helpEle.attr('title') !== undefined && $helpEle.attr('title').trim() !== ''),
            $dataTitle = ($helpEle.attr('data-title') !== undefined && $helpEle.attr('data-title').trim() !== '');

          if($title === false && $dataTitle === false){
            $helpEle.hide();
          }
        });
      }

      $(selector + " .help").on('mouseenter', function () {
        openTooltip($(this), pos);
      });

      // touch event if it's touch screen
      if (isTouch){
        $(selector + ' .help').on('click', function (e) {
          e.stopPropagation();
          openTooltip($(this), pos);
        });      
      }
    },
  };
})(jQuery);
