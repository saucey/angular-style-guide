import {
  Component, Input, Output, EventEmitter, ChangeDetectionStrategy
} from '@angular/core';

// import {FnolRepairshopService} from "../shared/services/fnol.data.service";


const template = require('./template.html');

@Component({
  selector: 'pagination-controls1',
  template: template,
 // providers: [FnolRepairshopService],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class PaginationControlsComponent {

  @Input() id: string;
  @Input() maxSize: number = 7;
  @Input()
  get directionLinks(): boolean {
    return this._directionLinks;
  }
  set directionLinks(value: boolean) {
    this._directionLinks = !!value && <any>value !== 'false';
  }
  @Input()
  get autoHide(): boolean {
    return this._autoHide;
  }
  set autoHide(value: boolean) {
    this._autoHide = !!value && <any>value !== 'false';
  }
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  private _directionLinks: boolean = true;
  private _autoHide: boolean = false;
}
