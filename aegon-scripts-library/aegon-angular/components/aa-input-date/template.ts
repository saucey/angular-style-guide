export const template = `
  <span class="aa-input-date">
      <input #dayEl class="aa-input-date__day aa-input-date__textfield" placeholder="dd" [required]="required" [ngModel]="day"
             type="number" min="0" inputmode="numeric" pattern="[0-9]*"
             (keydown)="keydown($event)" (keyup)="keyup('day', $event)"
             (focus)="dayEl.select()" (input)="keyup('day', $event)" (blur)="day = format(day, 2)"><!--
   --><input #monthEl class="aa-input-date__month aa-input-date__textfield" placeholder="mm" [required]="required" [ngModel]="month"
             type="number" min="0" inputmode="numeric" pattern="[0-9]*"
             (keydown)="keydown($event)" (keyup)="keyup('month', $event)"
             (focus)="monthEl.select()" (input)="keyup('month', $event)" (blur)="month = format(month, 2)"><!--
   --><input #yearEl class="aa-input-date__year aa-input-date__textfield" placeholder="jjjj" [required]="required" [ngModel]="year"
             type="number" min="0" max="9999" maxLength="4" inputmode="numeric" pattern="[0-9]*"
             (keydown)="keydown($event)" (keyup)="keyup('year', $event)"
             (focus)="yearEl.select()" (input)="keyup('year', $event)" (blur)="year = format(year, 4)">
    </span>
`