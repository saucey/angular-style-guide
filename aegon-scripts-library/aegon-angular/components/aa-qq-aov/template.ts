export const template = `
  <div class="quickquote angular aov-quote">
    <section class="personal-details">

      <h3 prefix="/">{{ data.options.personalDataHeading }}</h3>
      
      <div class="field gray-field">
        <div class="label">
          {{ data.options.birthDate.label }}
          <aa-hint [text]="data.options.birthDate.help"></aa-hint>
        </div>
        <div class="inputs" (click)="showCalculator = false">
          <aegon-input-date [(ngModel)]="birthDate"></aegon-input-date>
        </div>
      </div>
      <p class="error" *ngIf="birthDateError">{{ data.options.birthDate.error }}</p>

      <div class="field gray-field">
        <div class="label">
          {{ data.options.profession.label }}
          <aa-hint [text]="data.options.profession.help"></aa-hint>
        </div>
        <div class="inputs" (click)="showCalculator = false">
          <aa-input-dropdown
            [model]="profession"
            [items]="professionsFiltered"
            [emptyMessage]="data.options.profession.noMatchText"
            [minChars]="2"
            (aaFetch)="fetchProfessions($event)"
            (aaSelect)="selectProfession($event)">
          </aa-input-dropdown>
        </div>
      </div>
      <p class="error" *ngIf="professionError">{{ data.options.profession.error }}</p>

      <div class="field gray-field">
        <div class="label">
          {{ data.options.income.label }}
          <aa-hint [text]="data.options.income.help"></aa-hint>
        </div>
        <div class="inputs" (click)="showCalculator = false">
          <aa-input-number [(ngModel)]="grossIncome" (modelChange)="grossYearAmount = $event * 0.8" class="aa-input--euro"
                           [max]="data.options.income.max" defaultValue=""></aa-input-number>
        </div>
      </div>
      <p class="error" *ngIf="grossIncomeError">{{ data.options.income.error }}</p>

      <div class="field gray-field" *ngIf="!showCalculator">
        <div class="label"></div>
        <div class="inputs">
          <button class="button icon-right icon-calculator" (click)="openCalculator()">
            {{ data.options.calculateButtonText }}
          </button>
        </div>
      </div>
    </section>


    <section *ngIf="showCalculator" class="calculation">
      <div class="calculation indication">
        <h3 prefix="/">{{ data.options.otherChoicesHeading }}</h3>

        <div class="field">
          <div class="label">
            {{data.options.startingTerm.label}}
            <aa-hint [text]="data.options.startingTerm.help"></aa-hint>
          </div>
          <div class="inputs">
            <aa-input-radio *ngFor="#choice of data.options.startingTerm.choices" [name]="term"
                            [(ngModel)]="startingTerm" 
                            (aaChange)="fetchSpecification$.emit()"  
                            [value]="choice.value">{{ choice.label }}</aa-input-radio>
          </div>
        </div>
        
        <div class="calculation">
          <div class="field">
            <aa-slider-input class="aa-qq-aov__slider aa-qq__control aa-input--euro"
              [(ngModel)]="grossYearAmount"
              (change)="fetchSpecification$.emit()"
              [sliderOptions]="data.options.grossYearAmount.slider"
              [label]="data.options.grossYearAmount.label"
              [helpText]="data.options.grossYearAmount.help">
            </aa-slider-input>
          </div>
        </div>

        <div class="result">
          <div class="linear">
            <div class="row">
              <div class="label">
                {{ data.options.result.grossPremium.label }}
              </div>
              <div class="value">&euro; {{ grossPremium }}<span>,-</span></div>
              <span class="helptext">
                {{ data.options.result.grossPremium.help }}
              </span>
            </div>
            <div class="row">
              <div class="label">
                {{ data.options.result.netPremium.label }}
              </div>
              <div class="value">&euro; {{ netPremium }}<span>,-</span></div>
              <span class="helptext">
                {{ data.options.result.netPremium.help }}
              </span>
            </div>
          </div>
        </div>
        <div class="field">
          <a class="button orange icon-right arrow">
            {{ data.options.result.adviseButtonText }}
          </a>
          <div class="label">
            <a href="#" class="icon-skinnyarrow" (click)="gotoSummary()">
              {{ data.options.result.summaryButtonText }}
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
`;