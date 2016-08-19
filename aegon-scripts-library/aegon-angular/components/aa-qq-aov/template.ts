export const template = `
  <div class="quickquote angular aov-quote">
    <section class="personal-details" *ngIf="!showSummary">

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
            {{options.riskPeriod.label}}
            <aa-hint [text]="options.riskPeriod.help"></aa-hint>
          </div>
          <div class="inputs">
            <aa-input-radio [(ngModel)]="startingTerm" (aaChange)="fetchCalculationSpecification()" name="term" value="14">2 weken </aa-input-radio>
            <aa-input-radio [(ngModel)]="startingTerm" (aaChange)="fetchCalculationSpecification()" name="term" value="30">1 maand</aa-input-radio>
            <aa-input-radio [(ngModel)]="startingTerm" (aaChange)="fetchCalculationSpecification()" name="term" value="90">3 maanden</aa-input-radio>
            <aa-input-radio [(ngModel)]="startingTerm" (aaChange)="fetchCalculationSpecification()" name="term" value="365">1 jaar</aa-input-radio>
          </div>
        </div>

        <div class="field">
          <div class="inputs">
            <aa-slider-input class="aa-qq__control aa-input--euro"
              [(ngModel)]="grossYearAmount"
              (change)="fetchCalculationSpecification()"
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


    <div id="aov-quote-summary" *ngIf="showSummary">
      <h1>Samenvatting</h1>
      <h2 class="subtitle">Uw premie-indicatie</h2>
      <div id="premium-section" class="call-execution-block container_12  same-height row-fluid">
        <div class="data-section span12 container_12">
          <div class="span12 container_12 data-fields">
            <label class="label span6" for="field-geboortedatum">Uw geboortedatum</label>
            <span id="field-geboortedatum" class="value span6">20-03-2013</span>
          </div>
          <div class="span12 container_12 data-fields">
            <label class="label span6" for="field-beroep">Uw beroep</label>
            <span id="field-beroep" class="value span6">Palingvisser</span>
          </div>
          <div class="span12 container_12 data-fields">
            <label class="label span6" for="field-bruto-jaarinkomen">Uw bruto jaarinkomen</label>
            <span id="field-bruto-jaarinkomen" class="value span6">€ 40.000 netto</span>
          </div>
          <div class="span12 container_12 data-fields">
            <label class="label span6" for="field-eigen-risicoperiode">Eigen risicoperiode</label>
            <span id="field-eigen-risicoperiode" class="value span6">1 maand</span>
          </div>
          <div class="span12 container_12 data-fields">
            <label class="label span6" for="field-verzekerde-uitgaven">Verzekerde uitgaven</label>
            <span id="field-verzekerde-uitgaven" class="value span6">€ 1230 netto per maand</span>
          </div>
          <div class="span12 container_12 data-fields">
            <label class="label span6 dark-blue" for="field-bruto-premie">Bruto premie per maand</label>
            <span id="field-bruto-premie" class="value span6 dark-blue">€ 167</span>
          </div>
          <div class="span12 container_12 data-fields">
            <label class="label span6 dark-blue" for="field-netto-premie">Netto premie per maand</label>
            <span id="field-netto-premie" class="value span6 dark-blue">€ 108</span>
          </div>
        </div>
        <div class="action-section span12">
          <div class="row-fluid">
            <label class="span12 dark-blue" for="email-address-field">Samenvatting e-mailen</label>
            <div class="email-send-form-wrapper" [hidden]="reSendEmailShown">
              <input class="span5" id="email-address-field" [(ngModel)]="emailAddress" placeholder="Uw e-mailadres" tabindex="1" type="text">
              <button class="arrow span4" type="button" [class.pending]="emailButtonPending" [disabled]="emailAddress.trim()==''||emailButtonPending" (click)="sendEmailClick()">Vesturen</button>
              <p class="error span12" *ngIf="emailAddressError">
                Wilt u een geldige e-mailadres invoeren?
              </p>
            </div>
            <div class="email-resend-wrapper" [hidden]="!reSendEmailShown">
              <label class="span5 dark-blue" for="email-address-field">E-mail verstuurd</label>
              <button type="button" (click)="reSendEmailShown=false" class="button transparent arrow span6">Nogmaals versturen</button>
            </div>

            <label class="label span12 aanvragen-label dark-blue" for="aanvragen">Wilt u een vrijblijvend adviesgesprek?</label>
            <a class="arrow span8 orange aanvragen-button button" href="https://www.aegon.nl/zakelijk/inkomensverzekeringen/arbeidsongeschiktheidsverzekering/afspraak-arbeidsongeschiktheidsverzekering-advies">Neem contact met mij op</a>
          </div>
        </div>
      </div>
      <div class="static-section">
        <h3 class="title">Uitgangspunten</h3>
          U kunt de Aegon Arbeidsongeschiktheidsverzekering met een adviseur volledig aanpassen aan uw persoonlijke situatie.<br>
          Voor deze indicatie zijn we uitgegaan van:
          <ul class="bullet">
            <li>De meest uitgebreide dekking inclusief ongevallen, lichamelijke en psychische ziektes en zwangerschap en bevalling.</li>
            <li>Dat de verzekering tot 67 jaar loopt.</li>
            <li>Dat de hoogte van een uitkering gelijk blijft als u arbeidsongeschikt bent.</li>
            <li>Een doorlopende korting van 5%, die u houdt zolang uw verzekering bij ons loopt. U kunt ook kiezen voor een eenmalige korting van 30% in het eerste jaar.</li>
          </ul>
      </div>
      <div class="static-section">
        <h3 class="title">Uw geschatte maandpremie</h3>
        Uw geschatte premie is bruto € 167,19 per maand. Uw nettopremie na aftrek van belastingvoordeel is € 108,67 per maand. Dit is de maandpremie in het eerste kalenderjaar inclusief 5% doorlopende korting. Beide bedragen zijn een indicatie. Uw uiteindelijke maandpremie kan afwijken op basis van onder meer uw feitelijke werkzaamheden.
      </div>
      <div class="static-section">
        <h3 class="title">Hoe verder?</h3>
        Verzekeren is maatwerk. Uw adviseur kijkt samen met u wat het beste bij u past. Maak een afspraak voor een persoonlijk gesprek.<br>
        Aan het advies zijn kosten verbonden. Deze bespreekt u in het eerste vrijblijvende gesprek met de adviseur.
      </div>
    </div>
  </div>
`;