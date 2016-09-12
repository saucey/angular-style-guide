export const template = `
  <div id="aov-quote-summary">
      <h1>Samenvatting</h1>
      <h2 class="subtitle">Uw premie-indicatie</h2>
      <div id="premium-section" class="call-execution-block container_12  same-height row-fluid">
        <div class="data-section span12 container_12">
          <div class="span12 container_12 data-fields">
            <label class="label span6" for="field-geboortedatum">Uw geboortedatum</label>
            <span id="field-geboortedatum" class="value span6">{{aov_qq_data.birthDate}}</span>
          </div>
          <div class="span12 container_12 data-fields">
            <label class="label span6" for="field-beroep">Uw beroep</label>
            <span id="field-beroep" class="value span6">{{aov_qq_data.profession}}</span>
          </div>
          <div class="span12 container_12 data-fields">
            <label class="label span6" for="field-bruto-jaarinkomen">Uw bruto jaarinkomen</label>
            <span id="field-bruto-jaarinkomen" class="value span6">€ {{aov_qq_data.grossIncome |   money}}</span>
          </div>
          <div class="span12 container_12 data-fields">
            <label class="label span6" for="field-eigen-risicoperiode">Eigen risicoperiode</label>
            <span id="field-eigen-risicoperiode" class="value span6">{{aov_qq_data.startingTerm | period}}</span>
          </div>
          <div class="span12 container_12 data-fields">
            <label class="label span6" for="field-verzekerde-uitgaven">Verzekerde uitgaven</label>
            <span id="field-verzekerde-uitgaven" class="value span6">€ {{aov_qq_data.insuranceAmount | money}} netto per maand</span>
          </div>
          <div class="span12 container_12 data-fields">
            <label class="label span6" for="field-bruto-premie">Bruto premie per maand</label>
            <span id="field-bruto-premie" class="value span6">€ {{aov_qq_data.grossPremium | money}}</span>
          </div>
          <div class="span12 container_12 data-fields">
            <label class="label span6" for="field-netto-premie">Netto premie per maand</label>
            <span id="field-netto-premie" class="value span6">€ {{aov_qq_data.netPremium | money}}</span>
          </div>
        </div>
        <div class="action-section span12">
          <div class="row-fluid">
            <label class="span12 dark-blue" for="email-address-field">Samenvatting e-mailen</label>
            <div class="email-send-form-wrapper" [hidden]="reSendEmailShown">
              <input class="span6" id="email-address-field" [(ngModel)]="emailAddress" placeholder="Uw e-mailadres" tabindex="1" type="text">
              <button class="arrow span5" type="button" [class.pending]="emailButtonPending" [disabled]="emailAddress.trim()==''||emailButtonPending" (click)="sendEmailClick()">Versturen</button>
              <p class="error span12" *ngIf="emailAddressError">
                Wilt u een geldige e-mailadres invoeren?
              </p>
            </div>
            <div class="email-resend-wrapper" [hidden]="!reSendEmailShown">
              <label class="span5 dark-blue" for="email-address-field">E-mail verstuurd</label>
              <button type="button" (click)="reSendEmailShown=false" class="button transparent arrow span6">Nogmaals versturen</button>
            </div>

            <label class="label span12 aanvragen-label dark-blue" for="aanvragen">Wilt u een vrijblijvend adviesgesprek?</label>
            <a class="arrow span8 orange-gradient aanvragen-button button" [attr.href]="options.actionButton.url">{{ options.actionButton.label }}</a>
          </div>
        </div>
      </div>
      <div class="static-section">
        <h3 class="title">Uitgangspunten</h3>
        <p>
          U kunt de Aegon Arbeidsongeschiktheidsverzekering met een adviseur volledig aanpassen aan uw persoonlijke situatie.<br>
          Voor deze indicatie zijn we uitgegaan van:
        </p>  
          <ul class="bullet">
            <li>De meest uitgebreide dekking inclusief ongevallen, lichamelijke en psychische ziektes en zwangerschap en bevalling.</li>
            <li>Dat de verzekering tot 67 jaar loopt.</li>
            <li>Dat de hoogte van een uitkering gelijk blijft als u arbeidsongeschikt bent.</li>
            <li>Een doorlopende korting van 5%, die u houdt zolang uw verzekering bij ons loopt. U kunt ook kiezen voor een eenmalige korting van 30% in het eerste jaar.</li>
          </ul>
      </div>
      <div class="static-section">
        <h3 class="title">Uw geschatte maandpremie</h3>
        <p>
          Uw geschatte premie is bruto €  {{aov_qq_data.grossMonthly | money}} per maand. Uw nettopremie na aftrek van belastingvoordeel is € {{aov_qq_data.netMonthly | money}} per maand. Dit is de maandpremie in het eerste kalenderjaar inclusief 5% doorlopende korting. Beide bedragen zijn een indicatie. Uw uiteindelijke maandpremie kan afwijken op basis van onder meer uw feitelijke werkzaamheden.
        </p>
      </div>
      <div class="static-section">
        <h3 class="title">Hoe verder?</h3>
        <p>
          Verzekeren is maatwerk. Uw adviseur kijkt samen met u wat het beste bij u past. Maak een afspraak voor een persoonlijk gesprek.<br>
          Aan het advies zijn kosten verbonden. Deze bespreekt u in het eerste vrijblijvende gesprek met de adviseur.
        </p>
      </div>
    </div>
`;
