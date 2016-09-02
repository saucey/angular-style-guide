/**
 * Move element in the DOM, append or prepend to another parent
 */
import {Directive, Input, Output, NgZone, ElementRef} from 'angular2/core';
import {AABaseComponent} from '../../lib/classes/AABaseComponent';

@Directive({
  selector: 'aa-element,[aaAppend],[aaPrepend],[aaBefore],[aaAfter]'
})

export class AAElementDirective extends AABaseComponent {
  constructor(el: ElementRef) {
    super(el);
    var aaAppend = this.element.getAttribute('aaAppend'),
      aaPrepend = this.element.getAttribute('aaPrepend'),
      aaBefore = this.element.getAttribute('aaBefore'),
      aaAfter = this.element.getAttribute('aaAfter'),
      selector = aaAppend || aaPrepend || aaBefore || aaAfter;

    // Append if aaAppend given, prepend if aaPrepend is given
    if (!selector) {
      return;
    }
    let element = document.querySelector(selector);
    if (element) {
      setTimeout(() => {
        if (aaAppend) {
          element.appendChild(this.element);
        }
        if (aaPrepend) {
          element.insertBefore(this.element, element.firstChild);
        }
        if (aaBefore && element && element.parentNode) {
          element.parentNode.insertBefore(this.element, element);
        }
        if (aaAfter && element && element.parentNode) {
          element.parentNode.insertBefore(this.element, element.nextSibling);
        }
      });
    }
  }
}