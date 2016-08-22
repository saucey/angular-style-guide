export const template = `
  <span *ngIf="text" class="aa-hint" [ngClass]="'aa-hint--' + position" [attr.data-hint]="text">
    <span class="aa-hint__icon aa-hint__icon--help"></span>
  </span>
`;