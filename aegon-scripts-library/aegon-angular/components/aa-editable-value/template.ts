export const template = `
  <div class="aa-editable-value">
    <div *ngIf="!editing" class="aa-editable-value__label">
      <ng-content select="aa-editable-label"></ng-content>
      <a class="aa-editable-value__edit" (click)="editing = !editing">Wijzig</a>
    </div>
    <div *ngIf="editing" class="aa-editable-value__input">
      <ng-content select="aa-editable-input"></ng-content>
      <a class="aa-editable-value__save" (click)="editing = !editing">Sluiten</a>
    </div>
  </div>
`;
