export const template = `
  <div class="aov-form quickquote angular aov-quote">
  <div>



</div>
<section class="personal-details">
  <h1>Stel uw verzekering samen</h1>
  <h2>Uw situatie: Uw overlijidensrisicoverzekering koppelen aan uw hypotheek</h2>
  <ul class='aov-form__list'>
    <li class='aov-form__section'>
      <span class="aov-form__numberCircle">1</span>
      <h2>Wie wilt u verzekeren?</h2>
      Hier uitleggen waarom en in welke situatie  ik wat moet kiezen?
      <div class='aov-form__box'>
        <p class="main-color">Wie wilt u verzekeren?</p>
        <div class=" aov-form__selection">
          <label class="radio">
            <input type="radio" checked name="radio" value="value3"/>
            <span class="radio"></span>
            <div class="aov-form__radio__text">
              <p><strong>Mezelf</strong></p>
              <p>Hier tekst waarom ik alleen mezelf zou kiezen en niet een ander of allebei, in welke situatie moet ik wat kiezen?</p>
            </div>
          </label>
        </div>

        <div class=" aov-form__selection">
          <label class="radio">
            <input type="radio" checked name="radio" value="value3"/>
            <span class="radio"></span>
            <div class="aov-form__radio__text">
              <p><strong>Een ander</strong></p>
              <p>Hier tekst waarom ik een ander zou kiezen en mezelf of allebei. in welke situatie moet ik wat kiezen?</p>
            </div>
          </label>
        </div>

        <div class=" aov-form__selection">
          <label class="radio">
            <input type="radio" checked name="radio" value="value3"/>
            <span class="radio"></span>
            <div class="aov-form__radio__text">
              <p><strong>Mezelf en een andre</strong></p>
              <p>Hier tekst waarom ik ditczou kiezen en niet alleen een andre of ezelf. In welke situatie moet ik wat kiezen?</p>
            </div>
          </label>
        </div>

        <div class="field white-field">
          <div class="label main-color">
            {{ options.birthDate.label }}
            <aa-hint [text]="options.birthDate.help"></aa-hint>
          </div>
          <div (click)="showCalculator = false">
            <aegon-input-date [(ngModel)]="birthDate"></aegon-input-date>
          </div>
        </div>
        <p class="main-color">Heeft u de lasstste 2 jaar gerookt?</p>

        <div class=" aov-form__selection">
          <label class="radio">
            <input type="radio" checked name="radio" value="value3"/>
            <span class="radio"></span>
            <div class="aov-form__radio__text">
              <p><strong>ja</strong></p>
              <p>In welke situatie moet ik wat kiezen</p>
            </div>
          </label>
        </div>

        <div class=" aov-form__selection">
          <label class="radio">
            <input type="radio" checked name="radio" value="value3"/>
            <span class="radio"></span>
            <div class="aov-form__radio__text">
              <p><strong>Nee</strong></p>
              <p>Hier tekst waarom en in welke situatie moet ik wat kiezen?</p>
            </div>
          </label>
        </div>
        
        <ul class="actions edit row-fluid">
          <li class="edit span12">
            <button class="arrow" type="button">Opslaan en volgende vraag</button>
          </li>
        </ul>

      </div>
    </li>
    
    <li class='aov-form__section'>
      <span class="aov-form__numberCircle">2</span>
      <h2>Wanneer wilt u de verzekering laten ingaan?</h2>
      <p>Hier tekst waarom en in welke situatie moet ik wat kiezen? Verekering gaat altijd in per de eerste van de maand.</p>
      <div class='aov-form__box'>
        <p class="main-color">Ingangsmaand en jaar van uw verzekering</p>
        <div class="inputs">
            <select #mortgageSelect [(ngModel)]="mortgageType" class="no-dd" [class.error]="mortgageTypeErr" (change)="init($event.target.value);">
              <option [value]="0" selected>Maak uw keuze</option>
              <option [value]="1">Aflossingsvrij</option>
              <option [value]="2">Annuitair</option>
              <option [value]="3">(Bank)Spaar</option>
              <option [value]="4">Lineair</option>
              <option [value]="5">Overig</option>            
            </select>
          </div>
      </div>
    </li>
    
    <li class='aov-form__section'>
      <span class="aov-form__numberCircle">3</span>
      <h2>Hoe lang wilt u verzekerd zijn?</h2>
      Wie wilt u verzekeren?
      Hier uitleggen waarom en in welke situatie ik wat moet kiezen?
      <div>
      </div>
    </li>
    <li class='aov-form__section'>
      <span class="aov-form__numberCircle">4</span>
      <h2>Wat is de hoogte van de uitkering</h2>
      Wie wilt u verzekeren?
      Hier uitleggen waarom en in welke situatie ik wat moet kiezen?
      <div>
      </div>
    </li>
    <li class='aov-form__section'>
      <span class="aov-form__numberCircle">5</span>
      <h2>Welke uitkering past bij u?</h2>
      Wie wilt u verzekeren?
      Hier uitleggen waarom en in welke situatie ik wat moet kiezen?
      <div>
      </div>
    </li>
  </ul>
  <h3 prefix="/">{{ options.personalDataHeading }}</h3>

  <div class="field gray-field">
    <div class="label">
      {{ options.birthDate.label }}
      <aa-hint [text]="options.birthDate.help"></aa-hint>
    </div>
    <div class="inputs" (click)="showCalculator = false">
      <aegon-input-date [(ngModel)]="birthDate"></aegon-input-date>
      {{birthDate}}
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
      <button class="button icon-right icon-calculator" (click)="startCalculator()">
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
        <aa-input-radio *ngFor="#choice of options.startingTerm.choices" name="term"
                        [(ngModel)]="startingTerm"
                        (aaChange)="fetchSpecification()"
                        [value]="choice.value">{{ choice.label }}</aa-input-radio>
      </div>
    </div>

    <div class="field">
      <div class="inputs">
        <aa-slider-input class="aa-qq__control aa-input--euro"
                         [(ngModel)]="grossYearAmount"
                         (change)="fetchSpecification()"
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
          <div class="value">&euro; 300<span>,-</span></div>
          <span class="helptext">
                {{ options.result.grossPremium.help }}
              </span>
        </div>
        <div class="row">
          <div class="label">
            {{ options.result.netPremium.label }}
          </div>
          <div class="value">&euro; 300<span>,-</span></div>
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
