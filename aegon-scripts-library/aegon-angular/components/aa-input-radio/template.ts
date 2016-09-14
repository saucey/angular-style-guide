export const template = `
  <label class="radio">
    <input type="radio" [name]="name" [attr.checked]="value === model ? true : null" (click)="setValue(value)">
    <span class="radio"></span>
    <ng-content></ng-content>
  </label>
`;
