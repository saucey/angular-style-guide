import {Component, Input, Output, NgZone, ElementRef} from 'angular2/core';
import {template} from "./template";
import {AABaseComponent} from '../../lib/classes/AABaseComponent';
import {defaultOptions} from "./defaultOptions";
import {AAElementDirective} from '../../directives/aa-element/aa-element.directive';

import * as libDom from "../../lib/dom";

@Component({
  selector: 'aa-modal',
  template: template,
  directives: [AAElementDirective]
})

export class AAModalComponent extends AABaseComponent {
  @Input() options: any = {};
  @Input() data: any = {};
  @Input() visible: boolean = false;

  public defaultOptions : any = defaultOptions;
  public closing : boolean = false;

  private bodyMarginRight: string;
  private keyUpHandler : any;

  // Let parent class initialize config; the dependency injection with ElementRef
  // doesn't work directly so we have to call it explicitly.
  constructor(elementRef: ElementRef, private zone:NgZone) {
    super(elementRef);
    this.registerKeyHandler();
  }

  // Remove handlers on component destroy
  ngOnDestroy() {
    super.ngOnDestroy();
    this.unregisterKeyHandler();
  }

  private registerKeyHandler() : void {
    // Key handler
    if (this.keyUpHandler) {
      return;
    }
    this.keyUpHandler = (e) => {
      this.keyUp(e);
    };
    document.addEventListener('keyup', this.keyUpHandler, true);
  }

  private unregisterKeyHandler() : void {
    if (this.keyUpHandler) {
      document.removeEventListener('keyup', this.keyUpHandler);
      delete this.keyUpHandler;
    }
  }

  // Handle key up event
  private keyUp(e) : void {
    if (!this.visible) {
      return;
    }
    // Escape key
    if (e.keyCode == 27) { // escape key maps to keycode `27`
      if (this.data.options.close && this.data.options.escapeClose) {
        this.close();
      }
    }
  }

  // Save scrollbars on body
  private saveScroll() : void {
    if (this.data.options.hideScrollbar) {
      // Add margin size of scrollbar to body
      if (this.data.options.addScrollMargin) {
        let computedStyle = window.getComputedStyle(document.body),
          marginLeft = parseInt(computedStyle.marginLeft, 10) || 0,
          marginRight = parseInt(computedStyle.marginRight, 10) || 0,
          marginWidth =  marginLeft + marginRight,
          scrollbarWidth = window.innerWidth - document.body.offsetWidth - marginWidth;
        // Mimick hiding scrollbars
        if (scrollbarWidth > 0) {
          this.bodyMarginRight = document.body.style.marginRight; // Save old margin as-is
          document.body.style.marginRight = marginRight + scrollbarWidth + 'px';
        }
      }
      // Remove overflow
      libDom.addClass(document.body, this.data.options.bodyClassOpen);
    }
  }

  // Reset scrollbars on body
  private resetScroll() : void {
    if (this.data.options.hideScrollbar) {
      if (this.data.options.addScrollMargin) {
        document.body.style.marginRight = this.bodyMarginRight; // Put back old margin
        delete this.bodyMarginRight;
      }
      // Reset overflow
      libDom.removeClass(document.body, this.data.options.bodyClassOpen);
    }
  }

  // Background click handler
  private bgClick() : void {
    if (this.data.options.close && this.data.options.backgroundClose) {
      this.close();
    }
  }

  /**
   * PUBLIC API
   */
  // Open the modal (public api)
  public open() : void {
    this.saveScroll();
    this.registerKeyHandler();
    this.visible = true;
    this.refresh();
  }

  // Close the modal (public api)
  public close() : void {
    this.closing = true;
    this.unregisterKeyHandler();
    this.resetScroll();
    setTimeout(() => {
      this.closing = false;
      this.visible = false;
      this.refresh();
    }, this.data.options.closeDuration);
    this.refresh();
  }

  // Toggle modal based on current state
  public toggle() : void {
    if (this.visible) {
      return this.close();
    }
    return this.open();
  }

}
