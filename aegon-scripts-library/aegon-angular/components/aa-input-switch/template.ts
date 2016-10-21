export const template = `
<label class="aa-input-switch">
  <input [ngModel]="model" type="checkbox" [name]="name" [attr.checked]="value === model ? true : null" (click)="toggle()">
  <div class="aa-input-switch__slider"></div>
</label>
`;
