export const template = `
  <span class="aa-input-number">
    <span class="aa-input-number__prefix"></span>
    <span class="aa-input-number__suffix"></span>
    <input [attr.id]="inputId" #inputEl type="text" [attr.placeholder]="placeholder" [attr.required]="required"
      [ngModel]="model" (ngModelChange)="changeValue($event)" (keydown)="keydown($event)"
      (focus)="focus.emit()" (blur)="formatAndBlur()" (keydown.enter)="enter.emit()">
  </span>
`;