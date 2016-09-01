/**
 * Move element in the DOM, append or prepend to another parent
 */
import {Directive, Input, Output, NgZone, ElementRef} from 'angular2/core';
import {AABaseDirective} from '../../lib/classes/AABaseDirective';

@Directive({
  selector: '[aaAppend],[aaPrepend]'
})

export class AAAppendPrependDirective extends AABaseDirective {
  constructor(el: ElementRef) {
    super(el);
    var aaAppend = this.element.getAttribute('aaAppend'),
      aaPrepend = this.element.getAttribute('aaPrepend');

    // Append if aaAppend given, prepend if aaPrepend is given
    if (aaAppend || aaPrepend) {
      let parent = aaAppend ? document.querySelector(aaAppend) : document.querySelector(aaPrepend);
      if (parent) {
        setTimeout(() => {
          console.log(aaAppend ? 'appending' : 'prepending', aaAppend, aaPrepend, '=element', parent);
          if (aaAppend) {
            parent.appendChild(this.element);
          }
          if (aaPrepend) {
            parent.insertBefore(this.element, parent.firstChild);
          }
        });
      }
    }
  }
}