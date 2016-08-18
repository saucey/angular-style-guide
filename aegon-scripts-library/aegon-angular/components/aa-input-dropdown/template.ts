export const template = `
  <span class="input choice-dropdown" #dropDownEl>
    <input type="text" [attr.placeholder]="placeholder" [attr.required]="required"
      [ngModel]="model.label" (ngModelChange)="modelChange($event)" (blur)="blur(dropDownEl)" (keydown)="handleKey($event)">
    <ul class="choice-dropdown-choices" *ngIf="enabled && fetchValue.length >= minChars">
      <li *ngIf="!items && emptyMessage">{{emptyMessage}}</li>
      <li class="choice-dropdown-choice" *ngFor="#item of items" (click)="select(item)">{{item.label}}</li>
    </ul>
  </span>
`;