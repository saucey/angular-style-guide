export const template = `
  <label class="radio">
    <input type="radio" [name]="name" [attr.selected]="value === model" (click)="setValue(value)">
    <span class="radio"></span>
    <ng-content></ng-content>
  </label>
`;
