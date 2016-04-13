import {Component, Input, ViewChild, ElementRef} from "angular2/core";

@Component({
  selector: 'aegon-help',
  template: `
    <span #trigger class="help" (mouseover)="show()" (mouseout)="hide()" (click)="toggle($event)"></span>
    <span #dialog class="help dialog bottom"><div class="caret"></div><ng-content></ng-content></span>
  `
})
export class HelpComponent {
  @Input() text: string;
  @ViewChild('trigger') trigger: ElementRef;
  @ViewChild('dialog') dialog: ElementRef;
  visible: boolean = false;

  show(): void {
    // Doing it the low level native way, because we need to measure stuff in the DOM and set the dialog's position.
    let dialog = this.dialog.nativeElement,
      trigger = this.trigger.nativeElement;
    dialog.style.display = 'block';
    let left = trigger.offsetLeft - (dialog.offsetWidth / 2),
      top = trigger.offsetTop + trigger.offsetHeight + 20;
    dialog.style.left = left + 'px';
    dialog.style.top = top + 'px';
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
