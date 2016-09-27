export const template = `
  <span class="aa-input-dropdown" #dropDownEl>
    <input type="text" [attr.placeholder]="placeholder" [attr.required]="required"
      [ngModel]="model.label" (ngModelChange)="modelChange($event)" (blur)="blur(dropDownEl)" (keydown)="handleKey($event)">
    <ul class="aa-input-dropdown__choices" *ngIf="enabled && fetchValue.length >= minChars">
      <li *ngIf="!items && emptyMessage">{{emptyMessage}}</li>
      <li class="aa-input-dropdown__choice" *ngFor="let item of items" (click)="select(item)">{{item.label}}</li>
    </ul>
  </span>
`;
