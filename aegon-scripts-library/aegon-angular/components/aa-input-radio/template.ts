export const template = `
  <label class="radio">
    <input type="radio" [name]="name" (click)="setValue(value)">
    <span class="radio"></span>
    <ng-content></ng-content>
  </label>
`;
