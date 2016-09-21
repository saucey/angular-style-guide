export const template = `
  <!--<aa-sticky *ngIf="grossYearlyExpenseAmount" [heading]="data.options.sticky.heading">
    <h1 class="aa-sticky__heading">{{ data.options.sticky.subheading }}</h1>
    <aa-editable-value>
      <aa-editable-label>
        &euro; {{ grossYearlyExpenseAmount | money }] bruto per jaar*
      </aa-editable-label>
      <aa-editable-input>
        <aa-input-number [(ngModel)]="grossYearlyExpenseAmount">
      </aa-input-number>
      </aa-editable-input>
    </aa-editable-value>
    <p>{{ data.options.sticky.note }}</p>
  </aa-sticky>-->
  <div class="aa-qq-aov aa-qq" data-productcategory="inkomensverzekeringen" data-productname="aov">
    <section class="aa-qq-aov__personal-details" (select)="showCalculator = false">

      <h3 prefix="/">{{ data.options.personalDataHeading }}</h3>
      
      <div class="aa-qq-aov__field aa__clearfix">
        <div class="aa-qq-aov__label">
          {{ data.options.birthDate.label }}
        </div>
        <div class="aa-qq-aov__personal-details__hint">
          <aa-hint [text]="data.options.birthDate.help"></aa-hint>
        </div>
        <div class="aa-qq-aov__inputs" (click)="showCalculator = false">
          <aa-input-date [(ngModel)]="birthDate" class="aa-qq-aov__input" [setFocus]="setFocus"></aa-input-date>
        </div>
      </div>
      <p class="aa-error" *ngIf="birthDateError">{{ data.options.birthDate.error }}</p>

      <div class="aa-qq-aov__field aa__clearfix">
        <div class="aa-qq-aov__label">
          {{ data.options.profession.label }}
        </div>
        <div class="aa-qq-aov__personal-details__hint">
          <aa-hint [text]="data.options.profession.help"></aa-hint>
        </div>
        <div class="aa-qq-aov__inputs" (click)="showCalculator = false">
          <aa-input-dropdown class="aa-qq-aov__input"
            [model]="profession"
            [items]="professionsFiltered"
            [emptyMessage]="data.options.profession.noMatchText"
            [minChars]="2"
            (aaFetch)="fetchProfessions($event)"
            (aaSelect)="selectProfession($event)">
          </aa-input-dropdown>
        </div>
      </div>
      <p class="aa-error" *ngIf="professionError">{{ data.options.profession.error }}</p>

      <div class="aa-qq-aov__field aa__clearfix">
        <div class="aa-qq-aov__label">
          {{ data.options.income.label }}
        </div>
        <div class="aa-qq-aov__personal-details__hint">
          <aa-hint [text]="data.options.income.help"></aa-hint>
        </div>
        <div class="aa-qq-aov__inputs" (click)="showCalculator = false">
          <aa-input-number [(ngModel)]="grossIncome" (modelChange)="prefillGrossYearAmount($event)" class="aa-input--euro aa-qq-aov__input"
                           [max]="data.options.income.max" defaultValue=""></aa-input-number>
        </div>
      </div>
      <p class="aa-error" *ngIf="grossIncomeError">{{ data.options.income.error }}</p>

      <template [ngIf]="!showCalculator">
        <div class="aa-qq-aov__field aa__clearfix">
          <div class="aa-qq-aov__label"></div>
          <div class="aa-qq-aov__inputs">
            <button class="button icon-right icon-calculator aa-qq-aov__open-calculator" (click)="openCalculator()">
              {{ data.options.calculateButtonText }}
            </button>
          </div>
        </div>
      </template>
      
    </section>

    <template [ngIf]="showCalculator">
      <section class="aa-qq-aov__calculator">
        <h3 prefix="/">{{ data.options.otherChoicesHeading }}</h3>
        <div class="aa-qq-aov__field aa-qq-aob__radiobuttons aa__clearfix">
          <div class="aa-qq-aov__label">
            {{data.options.startingTerm.label}}
          </div>
          <div class="aa-qq-aov__personal-details__hint">
            <aa-hint [text]="data.options.startingTerm.help"></aa-hint>
          </div>
          <div class="aa-qq-aov__inputs">
            <div class="aa-qq-aov__radio" *ngFor="#choice of data.options.startingTerm.choices">
              <aa-input-radio name="term"
                [(ngModel)]="startingTerm" 
                (modelChange)="fetchSpecification$.emit()"
                [value]="choice.value">{{ choice.label }}</aa-input-radio>
            </div>
          </div>
        </div>
        
        <div class="aa-qq-aov__field aa__clearfix" 
             *ngIf="data.options.grossYearAmount.slider.range.max !== data.options.grossYearAmount.slider.range.min">
          <aa-slider-input class="aa-qq-aov__slider aa-qq__control aa-input--euro"
            [(ngModel)]="grossYearAmount"
            (modelChange)="fetchSpecification$.emit()"
            [sliderOptions]="data.options.grossYearAmount.slider"
            [label]="data.options.grossYearAmount.label"
            [helpText]="data.options.grossYearAmount.help">
          </aa-slider-input>
        </div>
        
        <div *ngIf="data.options.grossYearAmount.slider.range.max === data.options.grossYearAmount.slider.range.min">
          <div class="aa-qq-aov__field aa__clearfix">
            <div class="aa-qq-aov__label">
              {{ data.options.grossYearAmount.label }}
            </div>
            <div class="aa-qq-aov__personal-details__hint">
              <aa-hint [text]="data.options.grossYearAmount.help"></aa-hint>
            </div>
            <div class="aa-qq-aov__inputs">
              <aa-input-number [ngModel]="data.options.grossYearAmount.slider.range.min" 
                               class="aa-input--euro aa-qq-aov__input" [disabled]="true"></aa-input-number>
            </div>
          </div>
        </div>
      </section>
  
      <section class="aa-qq-aov__result">
        <div class="aa-qq-aov__result__container">
          <div class="aa-qq-aov__result__row">
            <div class="aa-qq-aov__result__label">
              {{ data.options.result.grossPremium.label }}
            </div>
            <aa-hint [text]="data.options.result.grossPremium.help"></aa-hint>
            <div class="aa-qq-aov__result__premium aa__clearfix">
              <span class="aa-qq-aov__result__currency">&euro;</span>
              {{ grossPremium }}
            </div>
          </div>
          <div class="aa-qq-aov__result__row">
            <div class="aa-qq-aov__result__label">
              {{ data.options.result.netPremium.label }}
            </div>
            <aa-hint [text]="data.options.result.netPremium.help"></aa-hint>
            <div class="aa-qq-aov__result__premium aa__clearfix">
              <span class="aa-qq-aov__result__currency">&euro;</span>
              {{ netPremium }}
            </div>
          </div>
        </div>
        
        <div class="aa-qq-aov__disclaimer">
          <div class="aa-qq__disclaimer aa-qq__disclaimer--star">{{ data.options.disclaimer.advisor }}</div>
          <div class="aa-qq__disclaimer aa-qq__disclaimer--star">{{ data.options.disclaimer.cost }}</div>
        </div>
        
        <div class="aa-qq-aov__actions">
          <span class="aa-qq-aov__actions__label">
            <a href="#" class="button arrow white" (click)="gotoSummary()">
              {{ data.options.result.summaryButtonText }}
            </a>
          </span>
          <a class="button orange icon-right arrow aa-qq-aov__action-right">
            {{ data.options.result.adviseButtonText }}
          </a>
        </div>
       
      </section>
    </template>
  </div>
`;
