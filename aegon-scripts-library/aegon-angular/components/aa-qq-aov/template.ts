export const template = `
  <div class="quickquote angular aov-quote">
    <section class="personal-details">

      <h3 prefix="/">{{ options.personalDataHeading }}</h3>
      
      <div class="field gray-field">
        <div class="label">
          {{ options.birthDate.label }}
          <aa-hint [text]="options.birthDate.help"></aa-hint>
        </div>
        <div class="inputs" (click)="showCalculator = false">
          <aegon-input-date [(ngModel)]="birthDate"></aegon-input-date>
        </div>
      </div>
      <p class="error" *ngIf="birthDateError">{{ options.birthDate.error }}</p>

      <div class="field gray-field">
        <div class="label">
          {{ options.profession.label }}
          <aa-hint [text]="options.profession.help"></aa-hint>
        </div>
        <div class="inputs" (click)="showCalculator = false">
          <aa-input-dropdown
            [model]="profession"
            [items]="professionsFiltered"
            [emptyMessage]="options.profession.noMatchText"
            [minChars]="2"
            (aaFetch)="fetchProfessions($event)"
            (aaSelect)="selectProfession($event)">
          </aa-input-dropdown>
        </div>
      </div>
      <p class="error" *ngIf="professionError">{{ options.profession.error }}</p>

      <div class="field gray-field">
        <div class="label">
          {{ options.income.label }}
          <aa-hint [text]="options.income.help"></aa-hint>
        </div>
        <div class="inputs" (click)="showCalculator = false">
          <aa-input-number [(ngModel)]="grossIncome" prefix="€" [max]="options.income.max"></aa-input-number>
        </div>
      </div>
      <p class="error" *ngIf="grossIncomeError">{{ options.income.error }}</p>

      <div class="field gray-field" *ngIf="!showCalculator">
        <div class="label"></div>
        <div class="inputs">
          <button class="button icon-right icon-calculator" (click)="openCalculator()">
            {{ options.calculateButtonText }}
          </button>
        </div>
      </div>
    </section>


    <section *ngIf="showCalculator" class="calculation">
      <div class="calculation indication">
        <h3 prefix="/">{{ options.otherChoicesHeading }}</h3>

        <div class="field">
          <div class="label">
            {{options.startingTerm.label}}
            <aa-hint [text]="options.startingTerm.help"></aa-hint>
          </div>
          <div class="inputs">
            <aa-input-radio *ngFor="#choice of options.startingTerm.choices" [name]="term"
                            [(ngModel)]="startingTerm" 
                            (aaChange)="fetchSpecification$.emit()"  
                            [value]="choice.value">{{ choice.label }}</aa-input-radio>
          </div>
        </div>

        <div class="field">
          <div class="inputs">
            <aa-slider-input class="aa-qq__control aa-input--euro"
              [(ngModel)]="grossYearAmount"
              (change)="fetchSpecification$.emit()"
              [sliderOptions]="options.grossYearAmount.slider"
              [label]="options.grossYearAmount.label"
              [helpText]="options.grossYearAmount.help">
            </aa-slider-input>
          </div>
        </div>

        <div class="result">
          <div class="linear">
            <div class="row">
              <div class="label">
                {{ options.result.grossPremium.label }}
              </div>
              <div class="value">&euro; {{ grossPremium }}<span>,-</span></div>
              <span class="helptext">
                {{ options.result.grossPremium.help }}
              </span>
            </div>
            <div class="row">
              <div class="label">
                {{ options.result.netPremium.label }}
              </div>
              <div class="value">&euro; {{ netPremium }}<span>,-</span></div>
              <span class="helptext">
                {{ options.result.netPremium.help }}
              </span>
            </div>
          </div>
        </div>
        <div class="field">
          <a class="button orange icon-right arrow">
            {{ options.result.adviseButtonText }}
          </a>
          <div class="label">
            <a href="#" class="icon-skinnyarrow" (click)="gotoSummary()">
              {{ options.result.summaryButtonText }}
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
`;