export const template = `
    <div class="quickquote angular boeterente">
      <div class="triangle"></div>
      <div class="calculation">
        <h3>Bereken indicatie omzettingskosten</h3>
        <div class="field">
          <div class="label">
            Hypotheekvorm van het leningdeel
            <aegon-help position="top">
              Voer hier de hypotheekvorm in van het leningdeel waarvan u de omzettingskosten wilt berekenen.
            </aegon-help>
          </div>
          <div class="inputs">
            <select [(ngModel)]="mortgageType" class="no-dd" [class.error]="mortgageTypeErr" (change)="init($event.target.value);">
              <option *ngFor="#m of mortgageOps; #i = index" [value]="i">{{m}}</option>
            </select>
          </div>
        </div>
        <div *ngIf="mortgageType == 2 || mortgageType == 4">
          <div class="messages messages--alert visible">
            <span class="icon"></span>
            <div class="content">
              <b>Let op!</b> Voor een lineaire of annuitaïre hypotheek zullen de werkelijke omzettingskosten lager uitvallen dan in deze indicatieberekening.
            </div>
          </div>
        </div>
        <div *ngIf="mortgageType == 3">
          <div class="messages messages--alert visible">
            <span class="icon"></span>
            <div class="content">
              <b>Let op!</b> U krijgt over het spaarsaldo dezelfde rente als u betaalt over de hypotheek. Een lagere hypotheekrente leidt tot een hogere spaarpremie. Ga goed na of uw netto maandlasten bij een lagere rente wel omlaag gaan en of u uw doelkapitaal haalt.
            </div>
          </div>
        </div>
        <div *ngIf="mortgageType > 0">
          <div class="field first">
            <div class="label">
              Oorspronkelijke bedrag
              <aegon-help position="top">
                Het totale bedrag van het leningdeel op het moment dat u de hypotheek afsloot.
              </aegon-help>
            </div>
            <div class="inputs">
              <aegon-input-number #amountInput [(ngModel)]="initialAmount" prefix="€" [placeholder]="'0'" [class.error]="initialAmountErr" (blur)="validate()"></aegon-input-number>
            </div>
          </div>
          <div class="field">
            <div class="label">
              Heeft u al extra afgelost op dit bedrag?
              <aegon-help position="top">
                Als u een annuitaïre of lineaire hypotheek heeft en u naast de reguliere aflossing niet extra heeft afgelost kiest u 'Nee'
              </aegon-help>
            </div>
            <div class="inputs">
              <aegon-input-radio [name]="'extraPymnt'" [checked] (change)="extraPymnt = false; validate()">Nee</aegon-input-radio>
              <aegon-input-radio [name]="'extraPymnt'" (change)="extraPymnt = true; validate()">Ja</aegon-input-radio>
            </div>
          </div>
          <div *ngIf="extraPymnt == true">
            <div class="field">
              <div class="label">
                Dit jaar
              </div>
              <div class="inputs">
                <aegon-input-number prefix="€" [(ngModel)]="pymntThisYear" (blur)="validate()" [class.error]="pymntThisYear > 0 && pymtsErr"></aegon-input-number>
              </div>
            </div>
            <div class="field">
              <div class="label">
                Voorgaande jaren
              </div>
              <div class="inputs">
                <aegon-input-number prefix="€" [(ngModel)]="pymntPrevYears" (blur)="validate()" [class.error]="pymntPrevYears > 0 && pymtsErr"></aegon-input-number>
              </div>
            </div>
          </div>
          <div class="field">
            <div class="label">
              Einddatum rentevastperiode
            </div>
            <div class="inputs">
              <aegon-input-date [(ngModel)]="interestPeriodEnd" [class.error]="interestPeriodEndErr" (change)="validate()"></aegon-input-date>
            </div>
          </div>
          <div class="field">
            <div class="label">
              Huidig rentepercentage
              <aegon-help position="top">
                Het rentepercentage dat is vastgelegd in uw huidige hypotheekcontract. 
              </aegon-help>
            </div>
            <div class="inputs short">
              <aegon-input-number #amountInput [(ngModel)]="oldIntRate" [class.error]="oldIntRateErr" [max]="100"
                                 [placeholder]="'4,0%'" (change)="validate()" forceDecimals="1">
              </aegon-input-number>
            </div>
          </div>
          <div class="field">
            <div class="label">
              NHG van toepassing
              <aegon-help position="top">
                Geef hier aan of op uw hypotheek de Nationale Hypotheek Garantie (NHG) van toepassing is. 
              </aegon-help>
            </div>
            <div class="inputs">
              <aegon-input-radio [name]="'nhg'" [class.error]="nhgErr" (change)="nhg = false; validate()">Nee</aegon-input-radio>
              <aegon-input-radio [name]="'nhg'" [class.error]="nhgErr" (change)="nhg = true; validate()">Ja</aegon-input-radio>
            </div>
          </div>
          <div class="field">
            <div class="label"></div>
            <div class="inputs">
              <button class="button icon-right icon-calculator" [class.disabled]="!isReady" [ngClass]="{pending: calculating}" (click)="calculate()">
                Bereken
              </button>
            </div>
          </div>
        </div>
      </div>
      <div *ngIf="calculated">
        <div class="result">
          <div *ngIf="validIntst">
            <div class="bigger">
              <div class="row">
                <span class="label">Indicatie omzettingskosten</span>
                <div class="value">
                  <span class="curr">€</span>
                  <span class="amount">{{ totalFee | money }}*</span>
                </div>
                <div class="small">
                  <div class="row">
                    <div class="label"><p>Op basis van:<br>Resterende rentevastperiode: <b>{{ periodsLeft }} {{ periodsLeft > 1 ? 'maanden' : 'maand' }}</b><br>
                      Vergelijkingsrente: {{ newIntRate | money }}% <aegon-help position="top">Het actuele rentepercentage dat geldt voor de periode van uw resterende rentevastperiode. U vindt de geldende percentages op onze pagina met actuele rentepercentages. </aegon-help></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bigger">
              <div class="row">
                <span class="label">Optie 1: omzetten naar marktrente</span>
                <div class="small">
                  <div class="row">
                    <!-- Indicatie nieuwe rente intro text -->
                    <p>Na betaling van de omzettingskosten kunt u profiteren van een lagere rente. Het verschil in maandlasten is afhankelijk van de nieuwe rentevastperiode die u wenst.</p>
                  </div>                
                  <div class="row">
                    <div class="label"><p>Nieuwe rentevastperiode<span *ngIf="newPeriod > -1"> met rente: <b>{{ newPeriodInt | money }}%</b></span></p>
                    </div>
                    <div class="label">
                      <!-- These are the options for the interest period, the value is in months. -->
                      <select [(ngModel)]="newPeriod" class="no-dd" (change)="newPeriod = $event.target.value; calculateNewMonthlyPymnt();">
                        <option [value]="-1">Kies</option>
                        <option [value]="0">Variabele rente</option>
                        <option [value]="24">2 jaar</option>
                        <option [value]="60">5 jaar</option>
                        <option [value]="120">10 jaar</option>
                        <option [value]="180">15 jaar</option>
                        <option [value]="240">20 jaar</option>
                      </select>
                    </div>
                  </div>
                  <div class="row">
                    <div class="label"><p>Huidige rente per maand</p></div>
                    <span class="value">
                      <span class="curr">€</span>
                      <span class="amount">{{ monthlyFee | money }}</span> <small>bruto</small>
                    </span>
                  </div>
                  <div class="row">
                    <div class="label"><p>Nieuwe rente per maand</p></div>
                    <span class="value">
                      <span class="curr">€</span>
                      <span class="amount"><span *ngIf="newPeriod > -1">{{ newMonthlyPymnt | money }}</span><span *ngIf="newPeriod == -1">- </span></span> <small>bruto</small>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="bigger">
              <div class="row">
                <span class="label">Optie 2: rentemiddelen</span>
                <div class="small">
                  <div class="row"><div>
                    <!-- Optie 2 text -->
                    <p>De omzettingskosten worden met een renteopslag doorberekend. De oude en nieuwe rente wordt 'gemiddeld'. Log in bij Mijn Aegon om uw nieuwe rente per maand te zien.</p>
                  </div></div>
                </div>
              </div>
            </div>
            <div class="bigger">
              <div class="row">
                <span class="label">Hoe verder?</span>
                <div class="small">
                  <div class="row">
                    <!-- Hoe verder text -->
                    <p>Als het aanpassen van uw hypotheekrente u interessant lijkt ga dan naar Mijn Aegon en download uw hypotheekrente opties als PDF</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="cta-wrapper">
              <div class="row clearfix">
                <a href="#" class="button transparent arrow flleft">Meer over de voor- en nadelen van de opties</a>
                <a href="/mijnaegon/" class="button green icon-right icon-lock not-loggedin-content">Log in bij Mijn Aegon</a>
              </div>
            </div>
          </div>
          <div *ngIf="!validIntst" class="not-possible">
            <!-- User interest lower than market interest message -->
            <h4>Berekening niet mogelijk</h4>
            <p>Het ingevoerde rentepercentage is lager dan de nu geldende marktrente. Het is daarom niet mogelijk om de omzettingskosten te berekenen. Controleer of u het juiste rentepercentage heeft ingevoerd.</p>
          </div>
        </div>
        <div class="disclaimer">
        * De uitkomst van deze berekening is een indicatie en kan u helpen bij de overweging om uw hypotheekrente aan te passen. Aan de berekening kunnen geen rechten worden ontleend.
        </div>
      </div>
    </div>`;