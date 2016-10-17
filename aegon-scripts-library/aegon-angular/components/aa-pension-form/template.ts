export const template = `
<h1>Stel uw pensioenproduction samen</h1>
<h2 class="general-form__box__sub__header">Uw situatie: u gaat binnenkort met pensioen</h2>
    <ul class="number-form__list">
      <li class='number-form__list__section'>
      
        <span class="number-form__list__numberCircle">1</span>
        
        <span class="general-form__box__sub__header">Uw pensioenkapitaal</span>
        
        <div [@visibility]="editVisibility(1)"> 
          <div class="form-section__input__results">
            <span>€ {{pension['pensionAmount']| money}}</span>
            <span class="edit" (click)="editSection(1)"> > Aanpassen</span>
          </div>
        </div>
       
        <div [@visibility]="visibility[1]"> 
          <p class="general-form__para">Uw pensioenkapitaal heeft u opgebouwd bij al uw werkgevers</p>
          <div class="form-element-text__row">
              <div class="table">
                  <div class="row">
                      <div class="col form-element__column">
                        <span class="general-form__box__head">Hoogte van uw pensoenkapitaal</span>
                        <p>Heeft u bij meer pensioenverzekeraars een pensioenkapitaal? Tel dan alle bedragen bij elkaar op en vul het totaalbedrag hier in.</p>  
                        <div class="inputs">
                        
                          <aegon-input-number #amountInput prefix="€" [(ngModel)]="pension['pensionAmount']" [max]="99999999"
                                             (focus)="amountTooSmall = false; amountInput.select()" (keyup)="isValidAmount()"
                                             (enter)="submitAmount()" [placeholder]="'min 25.000'">
                          </aegon-input-number>
                          
                          <span class="error-message__wrapper" *ngIf="amountIsValid">
                            <p class="error">
                              Totaal bedrag moet minimaal €25.000 bedragen
                            </p>
                          </span>
                        </div>
                        
                        <button class="arrow button" type="button" (click)="goTo(1,2)" [disabled]="isValidAmount()">Volgende vraag</button>
                        
                      </div>
                      <div class="col form-text__column">
                          <span class="form-text__icon icon-piggy-bank"></span>
                          <span class="header">€ 95.0000</span>
                          <span class="content">is het kapitaal dat werknemers gemiddeld opbouwen bij 4 werkgevers</span>
                          <span class="brand">Bron:Aegon</span>
                      </div>
                  </div>
              </div>
          </div>
        </div>
      </li>
      <li class='number-form__list__section'>
        <span class="number-form__list__numberCircle">2</span>
        <span class="general-form__box__sub__header">Waar is uw pensioenkapitaal opgebouwd</span>
        
        <div [@visibility]="editVisibility(2)"> 
          <div class="form-section__input__results">
            <span>{{pension['pensionLocation']}}</span>
            <span class="edit" (click)="editSection(2)"> > Aanpassen</span>
          </div>
        </div>        
        
        <div [@visibility]="visibility[2]"> 
            <p class="general-form__para">Om het juiste rendement te kunnen tonen dient u hier in te vullen bij welke verzekeraars of pensioenfondsen uw pensioen is opgebouwd.</p>
            <div class="general-form__box">
              <span class="general-form__box__head">Uw pensioenkapitaal is opgebouwd bij</span>
              <div class="white-radio-wrapper">
                <label class="radio white-radio">
                  <input type="radio" name="aov.person" value="Aegon" [(ngModel)]="pension['pensionLocation']" (change)="pensionValidLocation = true" />
                  <span class="radio"></span>
                  <span class="label-text">Aegon</span>
                </label>
              
                <label class="radio white-radio">
                  <input type="radio" name="aov.person" value="Andere verzekeraar(s) of pensioenfonds(en)" [(ngModel)]="pension['pensionLocation']" (change)="pensionValidLocation = true"/>
                  <span class="radio"></span>
                  <span class="label-text">Andere verzekeraar(s) of pensioenfonds(en)</span>
                </label>
                
                <label class="radio white-radio">
                  <input type="radio" name="aov.person" value="Zowel bij Aegon als bij andere verzekeraar(s) of pensioenfonds(en)" [(ngModel)]="pension['pensionLocation']" (change)="pensionValidLocation = true"/>
                  <span class="radio"></span>
                  <span class="label-text">Zowel bij Aegon als bij andere verzekeraar(s) of pensioenfonds(en)</span>
                </label>
              </div>
              <button class="arrow button" type="button" (click)="goTo(2,3)" [disabled]="!pensionValidLocation">Volgende vraag</button>
          </div>
        </div>
        
      </li>
      <li class='number-form__list__section'>
        <span class="number-form__list__numberCircle">3</span>
        <span class="general-form__box__sub__header">Partnerpensioen meeverzekeren?</span>
        
        <div [@visibility]="editVisibility(3)"> 
          <div class="form-section__input__results">
            <span class="block">
              {{pension['whofor']}}
            </span>
            <span *ngIf='hasPartner !== "hidden" 'class="block">
                {{pension['partnersInfo']}}
            </span>             
            <span class="block" *ngIf='hasPartner !== "hidden" && partnersDobReadable[1] !== "" && initChangeNoPolicy == false'>
               Geboortedatum partner {{partnersDobReadable[1]}}
            </span>
            <span class="edit" (click)="editSection(3)"> > Aanpassen</span>
          </div>
        </div>
       
        <div [@visibility]="visibility[3]"> 
          <p class="general-form__para">Heeft u een partner? En wilt u dat uw partner een pensioenuitkering krijgt na uw overlijden? Dan kunt u een partnerpensioen verzekeren. De uitkering is 70% van het pensioen dat u ontvangt.</p>
          <div class="form-element-text__row">
              <div class="table">
                  <div class="row">
                      <div class="col form-element__column">
                      
                        <span class="general-form__box__head">Heeft u een partner?</span>
                        
                        <div class="white-radio-wrapper">
                          <label class="radio white-radio">
                            <input type="radio" name="aov.who" value="Ja, ik heb een partner" [(ngModel)]="pension['whofor']" (change)="hasPartner = 'show'; initChangeHasPartnerYes = true" />
                            <span class="radio"></span>
                            <span class="label-text">Ja, ik heb een partner</span>
                          </label>
                        
                          <label class="radio white-radio">
                            <input type="radio" name="aov.who" value="Nee, ik heb geen partner" [(ngModel)]="pension['whofor']" (change)="hasPartner = 'hidden'; initChangeHasPartnerNo = true" />
                            <span class="radio"></span>
                            <span class="label-text">Nee, ik heb geen partner</span>
                          </label>
                        </div>
                        <div [@visibility]="hasPartner">
                          <span class="general-form__box__head">Wilt u een partnerpensioen voor uw partner verzekeren?</span>
                            <div class="white-radio-wrapper">
                              <label class="radio white-radio extended-text">
                                <input type="radio" name="aov.partner" value="Ja, ik wil een partnerpensioen verzekeren" [(ngModel)]="pension['partnersInfo']" (change)="partnerDob = 'show'; initChangeNoPolicy = false" />
                                <span class="radio"></span>
                                <span class="label-text"><strong>Ja, ik wil een partnerpensioen verzekeren</strong></span>
                                <span class="label-text">bij mijn overlijden ontvangt mijn partner 70% van het <br> pensioen dat ik zelf ontvang</span>
                              </label>
                            
                              <label class="radio white-radio extended-text">
                                <input type="radio" name="aov.partner" value="Nee, ik wil geen partnerpensioen verzekeren" [(ngModel)]="pension['partnersInfo']" (change)="partnerDob = 'hidden'; initChangeNoPolicy = true " />
                                <span class="radio"></span>
                                <span class="label-text"><strong>Nee, ik wil geen partnerpensioen verzekeren</strong></span>
                                <span class="label-text">bij mijn overlijden ontvangt mijn partner geen <br> partnerpensioen. Hier moet uw partner schriftelijk mee <br> instemmen</span>
                              </label>
                            </div>
                            <div [@visibility]="partnerDob">
                              <div style="height: 100%;">
                                <span class="general-form__box__head">Uw geboortedatum</span>
                                
                                <div class="inputs birthdate">
                                  <aa-input-date (modelChange)="validateUserAge($event, 1)" [(ngModel)]="pension['birthDateOfPartner']" class="aa-qq-aov__input" [setFocus]="setFocus"></aa-input-date>
                                  
                                  <span class="error-message__wrapper" *ngIf="userAgeInvalid[1]">
                                    <p class="error">
                                      User age in is invalid
                                    </p>
                                  </span>
                                
                                  <span class="error-message__wrapper" *ngIf="userToYoung[1]">
                                    <p class="error">
                                      User to young
                                    </p>
                                  </span>
                                  
                                  <span class="error-message__wrapper" *ngIf="userToOld[1]">
                                    <p class="error">
                                      User to old
                                    </p>
                                  </span>
                                </div>
                              </div>
                            </div>
                        </div>
                        <div>
                          <button class="arrow button" type="button" (click)="goTo(3,4)" [disabled]="btnValidationForUserPartner()">Volgende vraag</button>
                        </div>  
                      </div>
                      <div class="col form-text__column">
                          <span class="form-text__icon icon-calendar-date-2"></span>
                          <span class="header">66 jaar</span>
                          <span class="content">is de gemiddelde pensioenieeftijd</span>
                          <span class="brand">Bron:CBS</span>
                      </div>
                  </div>
              </div>
          </div>
        </div>
      </li>
      <li class='number-form__list__section'>
        <span class="number-form__list__numberCircle">4</span>
        <span class="general-form__box__sub__header">Persoonlijke gegevens</span>
        
        <div [@visibility]="editVisibility(4)"> 
          <div class="form-section__input__results">
            <span>Mijn geboortedatum {{pension['birthDate']| dateToReadableString}} </span>
            <span class="edit" (click)="editSection(4)"> > Aanpassen</span>
          </div>
        </div>
       
        <div [@visibility]="visibility[4]"> 
          <p class="general-form__para">Om uw pensioenuitkering exact uit te rekenen hebben we uw geboortedatum nodig</p>
          <div class="form-element-text__row">
              <div class="table">
                  <div class="row">
                      <div class="col form-element__column">
                      
                        <span class="general-form__box__head">Uw geboortedatum</span>
                        
                        <div class="inputs birthdate">
                          <aa-input-date (modelChange)="validateUserAge($event, 2)" [(ngModel)]="pension['birthDate']" class="aa-qq-aov__input" [setFocus]="setFocus"></aa-input-date>
                          
                          <span class="error-message__wrapper" *ngIf="userAgeInvalid[2]">
                            <p class="error">
                              User age in is invalid
                            </p>
                          </span>
                        
                          <span class="error-message__wrapper" *ngIf="userToYoung[2]">
                            <p class="error">
                              User to young
                            </p>
                          </span>
                          
                          <span class="error-message__wrapper" *ngIf="userToOld[2]">
                            <p class="error">
                              User to old
                            </p>
                          </span>
                          
                        </div>
                        
                        <button class="arrow button" type="button" (click)="goTo(4,5)" [disabled]="isAgeValid[2]">Volgende vraag</button>
                        
                      </div>
                      <div class="col form-text__column">
                          <span class="form-text__icon icon-calendar-date-2"></span>
                          <span class="header">80%</span>
                          <span class="content">van pensioenaanvragers met een partner verzekert een partnerpensioen</span>
                          <span class="brand">Bron:Aegon</span>
                      </div>
                  </div>
              </div>
          </div>
        </div>
      </li>
      <li class='number-form__list__section'>
        <span class="number-form__list__numberCircle">5</span>
        <span class="general-form__box__sub__header">Wanneer wilt u de pensioenverzekering laten ingaan?</span>
        
        <div [@visibility]="editVisibility(5)"> 
          <div class="form-section__input__results">
            <span>{{startingDate | dateToReadableString}}</span>
            <span class="edit" (click)="editSection(5)"> > Aanpassen</span>
          </div>
        </div>
       
        <div [@visibility]="visibility[5]"> 
          <p class="general-form__para">Hier uitleggen waarom je een bepaalde datum zou kiezen en wat het voordeel is om bijvoorbeeld later te beginnen met uitkeren dan direct op je pensioenleeftijd.</p>
          <div class="form-element-text__row">
              <div class="table">
                  <div class="row">
                      <div class="col form-element__column">
                        <span class="general-form__box__head">Ingangsdatum van uw pensioenverzekering</span>
                        <p>De ingangsdatum van uw pensioen is altijd per de 1ste van de maand. De pensioenuitkering ontvangt u dan niet direct. die ontvangt u altijd aan het einde van de maand (rond de 25ste).</p>
                        
                        <div class="inputs select">
                          <select [ngModel]="startingDate" class="no-dd" (change)="changeStartingDate($event.target.value)" required>
                            <option value="" disabled>Maak uw keuze</option>
                            <option *ngFor="let date of startingDateChoices" [value]="date.value">{{date.label}}</option>
                          </select>
                        </div>
                        
                        <button class="button icon-right icon-calculator" type="button" (click)="goTo(5); submitForm(pension)" [disabled]="startingDate == ''">Bereken pensioenuitkering</button>
                        
                      </div>
                      <div class="col form-text__column">
                          <span class="form-text__icon icon-piggy-bank"></span>
                          <span class="content">Meest gekozen ingangsdatum is 7 maanden na de pensioengerechtigde leeftijd </span>
                          <span>Bron:Aegon</span>
                      </div>
                  </div>
              </div>
          </div>
        </div>
      </li>
    </ul>
`;
