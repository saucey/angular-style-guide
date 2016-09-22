export const template = `
  <div class="field white-field">
    <div class="label main-color">
    </div>
    <div (click)="showCalculator = false">
      <aegon-input-date [(ngModel)]="birthDate"></aegon-input-date>
    </div>
  </div>
  
  <p class="main-color">Heeft u de lasstste 2 jaar gerookt?</p>
  <div class=" aov-form__selection">
    <label class="radio">
      <input type="radio" checked name="smokerYou" value="value3"/>
      <span class="radio"></span>
      <div class="aov-form__radio__text">
        <p><strong>ja</strong></p>
      </div>
    </label>
  </div>
  
  <div class=" aov-form__selection">
    <label class="radio">
      <input type="radio" checked name="smokerYou" value="value3"/>
      <span class="radio"></span>
      <div class="aov-form__radio__text">
        <p><strong>Nee</strong></p>
      </div>
    </label>
  </div>
  
  <ul class="actions edit row-fluid">
    <li class="edit span12">
      <button class="arrow" type="button">Opslaan en volgende vraag</button>
    </li>
  </ul>
`;
