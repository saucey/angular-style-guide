export const template = `
    <div class="quickquote angular aa-boeterente">
      <div class="triangle"></div>
      <div class="calculation">
        <h3>{{ data.options.personalDataHeading }}</h3>
        <div class="field">
          <div class="label">
            {{ data.options.mortgageType }}
            <aa-hint [text]="data.options.mortgageTypeHint"></aa-hint>
          </div>
          <div class="inputs">
            <select #mortgageSelect [(ngModel)]="mortgageType" class="no-dd" (change)="init($event.target.value);">
              <option [value]="0" selected>{{ data.options.mortgageTypesPlaceholder }}</option>
              <option [value]="1">{{ data.options.mortgageTypesLabels[0] }}</option>
              <option [value]="2">{{ data.options.mortgageTypesLabels[1] }}</option>
              <option [value]="3">{{ data.options.mortgageTypesLabels[2] }}</option>
              <option [value]="4">{{ data.options.mortgageTypesLabels[3] }}</option>
              <option [value]="5">{{ data.options.mortgageTypesLabels[4] }}</option>            
            </select>
          </div>
        </div>
        <div *ngIf="mortgageType == 2 || mortgageType == 4">
          <div class="messages messages--alert visible">
            <span class="icon"></span>
            <div class="content"><b>{{ data.options.payAttention }}</b> {{ data.options.annuityInfoBox }}</div>
          </div>
        </div>
        <div *ngIf="mortgageType == 3">
          <div class="messages messages--alert visible">
            <span class="icon"></span>
            <div class="content">
              <b>{{ data.options.payAttention }}</b> {{ data.options.savingsInfoBox }}
            </div>
          </div>
        </div>
        <div *ngIf="mortgageType > 0">
          <div class="field first">
            <div class="label">
              {{ data.options.initialAmountLabel }}
              <aa-hint [text]="data.options.initialAmountHint"></aa-hint>
            </div>
            <div class="inputs">
              <aa-input-number 
                class="aa-input--euro" 
                [(ngModel)]="initialAmount"
                defaultValue=""
                [placeholder]="'0'"
                [class.error]="initialAmountErr"
                (blur)="validate()">
              </aa-input-number>
            </div>
          </div>
          <div class="field">
            <div class="label">
              {{ data.options.extraPaymentLabel }}
              <aa-hint  [text]="data.options.extraPaymentHint"></aa-hint>
            </div>
            <div class="inputs">

            <aa-input-radio [name]="'extraPymnt'"
                            [(ngModel)]="extraPymnt" 
                            (aaChange)="validate()"  
                            [value]="false">{{ data.options.extraPaymentNoLabel }}</aa-input-radio>
            <aa-input-radio [name]="'extraPymnt'" 
                            [(ngModel)]="extraPymnt" 
                            (aaChange)="validate()"  
                            [value]="true">{{ data.options.extraPaymentYesLabel }}</aa-input-radio>

            </div>
          </div>
          <div *ngIf="extraPymnt == true">
            <div class="field">
              <div class="label">
                {{ data.options.extraPaymentThisYearLabel }}
              </div>
              <div class="inputs">
              
                <aa-input-number 
                  class="aa-input--euro" 
                  [(ngModel)]="pymntThisYear"
                  defaultValue=""
                  [placeholder]="'0'"
                  [class.error]="pymntThisYear > 0 && pymtsErr"
                  (blur)="validate()">
                </aa-input-number>
              
              </div>
            </div>
            <div class="field">
              <div class="label">
                {{ data.options.extraPaymentLastYearLabel }}
              </div>
              <div class="inputs">
                <aa-input-number 
                  class="aa-input--euro" 
                  [(ngModel)]="pymntPrevYears"
                  defaultValue=""
                  [placeholder]="'0'"
                  [class.error]="pymntPrevYears > 0 && pymtsErr"
                  (blur)="validate()">
                </aa-input-number>

              </div>
            </div>
          </div>
          <div class="field">
            <div class="label">
              {{ data.options.interestPeriodEndDateLabel }}
            </div>
            <div class="inputs">
              <aa-input-date [(ngModel)]="interestPeriodEnd" [class.error]="interestPeriodEndErr" (change)="validate()"></aa-input-date>
            </div>
          </div>
          <div class="field">
            <div class="label">
              {{ data.options.currentInterestRateLabel }}
              <aa-hint [text]="data.options.currentInterestRateHint"></aa-hint>
            </div>
            <div class="inputs short">
            <aa-input-number 
                  #amountInput
                  [(ngModel)]="oldIntRate"
                  defaultValue=""
                  [placeholder]="data.options.currentInterestRatePlaceholder"
                  [class.error]="oldIntRateErr"
                  [forceDecimals]="1"
                  [allowDecimals]="true"
                  [max]="100"
                  (change)="validate()">
                </aa-input-number>
            </div>
          </div>
          <div class="field">
            <div class="label">
              {{ data.options.nhgApplicableLabel }}
              <aa-hint [text]="data.options.nhgApplicableHint"></aa-hint>
            </div>
            <div class="inputs">
            <aa-input-radio [name]="'nhg'"
                            [(ngModel)]="nhg" 
                            [class.error]="nhgErr"
                            (aaChange)="validate()"  
                            [value]="false">{{ data.options.nhgApplicableNoLabel }}</aa-input-radio>
            <aa-input-radio [name]="'nhg'" 
                            [(ngModel)]="nhg" 
                            [class.error]="nhgErr"
                            (aaChange)="validate()"  
                            [value]="true">{{ data.options.nhgApplicableYesLabel }}</aa-input-radio>

            </div>
          </div>
          <div class="field">
            <div class="label"></div>
            <div class="inputs">
              <button class="button icon-right icon-calculator" [class.disabled]="!isReady" [ngClass]="{pending: calculating}" (click)="calculate()">
                {{ data.options.calculateButtonLabel }}
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
                <span class="label">{{ data.options.results.headline }}</span>
                <div class="value">
                  <span class="curr">€</span>
                  <span class="amount">{{ totalFee | money }}*</span>
                </div>
                <div class="small">
                  <div class="row">
                    <div class="label">
                    <p>
                      {{ data.options.results.subHeadline }}<br>
                      {{ data.options.results.remainingPeriod }} <b>{{ periodsLeft }} {{ periodsLeft > 1 ? 'maanden' : 'maand' }}</b><br>
                      {{ data.options.results.interestRate }}: {{ newIntRate | money }}% 
                      <aa-hint [text]="data.options.results.interestRateHint"></aa-hint>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bigger">
              <div class="row">
                <span class="label">{{ data.options.results.option1Headline }}</span>
                <div class="small">
                  <div class="row">
                    <!-- Indicatie nieuwe rente intro text -->
                    <p> {{ data.options.results.option1.desc }}
                      <a href="{{ data.options.results.option1.learnMoreUrl }}" class="button arrow transparent inline">
                        {{ data.options.results.option1.learnMoreText }}
                      </a>
                    </p>
                  </div>                
                  <div class="row">
                    <div class="label">
                      <p>
                      {{ data.options.results.option1.newInterestPeriodLabel }}
                      <span *ngIf="newPeriod > -1"> {{ data.options.results.option1.newInterestPeriodWithInterest }}: <b>{{ newPeriodInt | money }}%</b></span></p>
                    </div>
                    <div class="label">
                      <!-- These are the options for the interest period, the value is in months. -->
                      <select [(ngModel)]="newPeriod" class="no-dd" (change)="newPeriod = $event.target.value; calculateNewMonthlyPymnt();">
                        <option [value]="-1">Kies</option>
                        <option *ngFor="#item of data.options.results.option1.newInterestPeriods" [value]="item.value">
                          {{ item.label }}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div class="row">
                    <div class="label"><p>{{ data.options.results.option1.currentInterestPerMonth }}</p></div>
                    <span class="value">
                      <span class="curr">€</span>
                      <span class="amount">{{ monthlyFee | money }}</span> <small>{{ data.options.results.option1.currentInterestPerMonthGross }}</small>
                    </span>
                  </div>
                  <div class="row">
                    <div class="label"><p>{{ data.options.results.option1.newInterestPerMonth }}</p></div>
                    <span class="value">
                      <span class="curr">€</span>
                      <span class="amount"><span *ngIf="newPeriod > -1">{{ newMonthlyPymnt | money }}</span><span *ngIf="newPeriod == -1">- </span></span> <small>{{ data.options.results.option1.newInterestPerMonthGross }}</small>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="bigger" *ngIf="mortgageType != 3 && mortgageType != 5">
              <div class="row">
                <span class="label">{{ data.options.results.option2A.headline }}</span>
                <div class="small">
                  <div class="row"><div>
                    <!-- Optie 2 text for rentemiddelen -->
                    <p>{{ data.options.results.option2A.desc }}<br>
                      <a href="{{ data.options.results.option2A.learnMoreUrl}}" class="button arrow transparent inline">{{ data.options.results.option2A.learnMoreText }}</a>
                    </p>
                  </div></div>
                </div>
              </div>
            </div>
            <div class="bigger" *ngIf="mortgageType == 3 || mortgageType == 5">
              <div class="row">
                <span class="label">{{ data.options.results.option2B.headline }}</span>
                <div class="small">
                  <div class="row"><div>
                    <!-- Optie 2 text for Spaar and Overige -->
                    <p>{{ data.options.results.option2B.desc }}</p>
                  </div></div>
                </div>
              </div>
            </div>
            <div class="bigger">
              <div class="row">
                <span class="label">{{ data.options.results.whatNextHeadline }}</span>
                <div class="small">
                  <div class="row">
                    <!-- Hoe verder text -->
                    <p>{{ data.options.results.whatNextDesc }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="cta-wrapper">
              <div class="row clearfix">
                <a href="#" class="button transparent arrow flleft">{{ data.options.results.learnMoreText }}</a>
                <!-- log in to mijn aegon button (user is logged out) -->
                <a href="/sso-box/wayf.html?int_source=/inloggen/" class="button green icon-right icon-lock hide-if-shw-loggedin">Log in bij Mijn Aegon</a>
                <!-- go to mijn aegon button (user is logged in) -->
                <a href="/mijnaegon/mijnproducten" class="button green icon-right icon-lock hide-if-shw-loggedout inline-block">
                  {{ data.options.results.goToMyAegon }}
                </a>
              </div>
            </div>
          </div>
          <div *ngIf="!validIntst" class="not-possible">
            <!-- User interest lower than market interest message -->
            <h4>{{ data.options.results.calculationNotPossible }}</h4>
            <p>{{ data.options.results.calculationNotPossibleDesc }}</p>
          </div>
        </div>
        <div class="disclaimer">{{ data.options.results.disclaimer }}</div>
      </div>
    </div>`;
