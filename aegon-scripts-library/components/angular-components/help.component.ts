import {Component, Input, ViewChild, ElementRef} from "angular2/core";

@Component({
  selector: 'aegon-help',
  template: `
    <span #trigger class="help" (mouseover)="show()" (mouseout)="hide()" (click)="toggle($event)" title="{{ text }}"></span>
    <span #dialog class="help dialog {{position}}"><div #caret class="caret"></div><ng-content></ng-content></span>
  `
})
export class HelpComponent {
  @Input() text: string;
  @Input() position: string = "bottom";
  @ViewChild('trigger') trigger: ElementRef;
  @ViewChild('dialog') dialog: ElementRef;
  @ViewChild('caret') caret: ElementRef;
  visible: boolean = false;

  show(): void {
    // Doing it the low level native way, because we need to measure stuff in the DOM and set the dialog's position.
    let dialog = this.dialog.nativeElement,
      trigger = this.trigger.nativeElement,
      caret = this.caret.nativeElement;

    dialog.style.display = 'block';

    let left, top;
    // Set top and left of dialog.
    switch (this.position) {
      case 'top':
        top = trigger.offsetTop - dialog.offsetHeight - 10;
        left = trigger.offsetLeft - (dialog.offsetWidth / 2);
        break;
      case 'left':
        top = trigger.offsetTop - (dialog.offsetHeight / 2) + 10;
        left = trigger.offsetLeft - dialog.offsetWidth - 15;
        break;
      case 'right':
        top = trigger.offsetTop - (dialog.offsetHeight / 2) + 10;
        left = trigger.offsetLeft + 35;
        break;
      default:
        // default is bottom 
        top = trigger.offsetTop + trigger.offsetHeight + 20;
        left = trigger.offsetLeft - (dialog.offsetWidth / 2);
    }
    // Dialog position.
    dialog.style.left = left + 'px';
    dialog.style.top = top + 'px';

    /* Caret in dialog position. Needs to be
     * set after dialog is positioned.
     */
    switch (this.position) {
      case 'left':
      case 'right':
        caret.style.top = (trigger.offsetTop - dialog.offsetTop) + 'px';
        break;
      default:
        // default is bottom and top
        caret.style.left = (trigger.offsetLeft - dialog.offsetLeft) + 'px';
    }
    this.visible = true;
  }

  hide(): void {
    this.dialog.nativeElement.style.display = 'none';
    this.visible = false;
  }

  toggle(event): void {
    event.preventDefault();
    if (this.visible) {
      this.hide();
    } else {
      this.show();
    }
  }
}
