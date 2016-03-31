import {Component, Input, OnInit} from "angular2/core";

@Component({
  selector: 'aegon-help',
  template: `
    <span class="help" (mouseover)="show()" (mouseout)="hide()" (click)="toggle()"></span>
    <span class="help dialog bottom" [ngStyle]="{display: !visible && 'none' || null}"><ng-content></ng-content></span>
  `
})
export class HelpComponent {
  @Input() text:string;
  visible:boolean = false;

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }

  toggle() {
    this.visible = !this.visible;
  }
}
