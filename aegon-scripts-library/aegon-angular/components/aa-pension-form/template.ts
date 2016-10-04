export const template = `
<h1>Stel uw pensioenproduction samen</h1>
<h2 class="general-form__box__sub__header">Uw situatie: u gaat binnenkort met pensioen</h2>

    <ul class="number-form__list">
      <li class='number-form__list__section'>
        <span class="number-form__list__numberCircle">1</span>
        <span class="general-form__box__sub__header">Uw pensioenkapitaal</span>
        
        <div [@visibility]="editVisibility1(visibility.one)"> 
          <div style="padding: 10px 30px 10px 20px; background-color:#D9EBF7; border-radius: 5px;">
            <span>€ {{pensionAmount}}</span>
            <span style="float: right; cursor:pointer;" (click)="editSection('box1')"> > Aanpassen</span>
          </div>
        </div>
       
        <div [@visibility]="visibility.one"> 
          <p>Uw pensioenkapitaal heeft u opgebouwd bij al uw werkgevers</p>
          <div class="form-element-text__row">
              <div class="table">
                  <div class="row">
                      <div class="col form-element__column">
                        <span class="general-form__box__head">Hoogte van uw pensoenkapitaal</span>
                        <p>Heeft u bij meer pensioenverzekeraars een pensioenkapitaal? Tel dan alle bedragen bij elkaar op en vul het totaalbedrag hier in.</p>  
                        <div class="inputs">
                        
                          <aegon-input-number #amountInput prefix="€" [(ngModel)]="pensionAmount" [max]="99999999"
                                             (focus)="amountTooSmall = false; amountInput.select()" (blur)="isValidAmount()"
                                             (enter)="submitAmount()" [placeholder]="'min 25.000'">
                          </aegon-input-number>
                          
                        <span *ngIf="isValidAmount()">
                          value of the input is too low!
                        </span>
                        </div>
                        
                        <button class="arrow button" type="button" (click)="submitAmount()" [disabled]="isValidAmount()">Volgende vraag</button>
                        
                      </div>
                      <div class="col form-text__column">
                          <h2>Sidebar</h2>
                          <p>Subscribe to the newsletter!</p>
                      </div>
                  </div>
              </div>
          </div>
        </div>
      </li>
      <li class='number-form__list__section'>
        <span class="number-form__list__numberCircle">2</span>
        <span class="general-form__box__sub__header">Waar is uw pensioenkapitaal opgebouwd</span>
        
        <div [@visibility]="editVisibility2(visibility.two)"> 
          <div style="padding: 10px 30px 10px 20px; background-color:#D9EBF7; border-radius: 5px;">
            <span>{{pensionLocation}}</span>
            <span style="float: right; cursor:pointer;" (click)="editSection('box2')"> > Aanpassen</span>
          </div>
        </div>        
        
        <div [@visibility]="visibility.two"> 
            <p>Om het juiste rendement te kunnen tonen dient u hier in te vullen bij welke verzekeraars of pensioenfondsen uw pensioen is opgebouwd.</p>
            <div class="general-form__box">
              <span class="general-form__box__head">Uw pensioenkapitaal is opgebouwd bij</span>
              <div class="white-radio-wrapper">
                <label class="radio white-radio">
                  <input type="radio" name="aov.person" value="Aegon" [(ngModel)]="pensionLocation" />
                  <span class="radio"></span>
                  <span class="label-text">Aegon</span>
                </label>
              
                <label class="radio white-radio">
                  <input type="radio" name="aov.person" value="Andere verzekeraar(s) of pensioenfonds(en)" [(ngModel)]="pensionLocation" />
                  <span class="radio"></span>
                  <span class="label-text">Andere verzekeraar(s) of pensioenfonds(en)</span>
                </label>
                
                <label class="radio white-radio">
                  <input type="radio" name="aov.person" value="Zowel bij Aegon als bij andere verzekeraar(s) of pensioenfonds(en)" [(ngModel)]="pensionLocation" />
                  <span class="radio"></span>
                  <span class="label-text">Zowel bij Aegon als bij andere verzekeraar(s) of pensioenfonds(en)</span>
                </label>
              </div>
              <button class="arrow button" type="button" (click)="submitPensionLocation()" [disabled]="isValidAmount()">Volgende vraag</button>
          </div>
        </div>
        
      </li>
      
      <li class='number-form__list__section'>
        <span class="number-form__list__numberCircle">3</span>
        <span class="general-form__box__sub__header">Persoonlijke gegevens</span>
        
        <div [@visibility]="editVisibility3(visibility.three)"> 
          <div style="padding: 10px 30px 10px 20px; background-color:#D9EBF7; border-radius: 5px;">
            <span>€ {{pensionAmount}}</span>
            <span style="float: right; cursor:pointer;" (click)="editSection('box3')"> > Aanpassen</span>
          </div>
        </div>
       
        <div [@visibility]="visibility.three"> 
          <p>Om uw pensioenuitkering exact uit te rekenen hebben we uw geboortedatum nodig</p>
          <div class="form-element-text__row">
              <div class="table">
                  <div class="row">
                      <div class="col form-element__column">
                      
                        <span class="general-form__box__head">Uw geboortedatum</span>
                        
                        <div class="inputs birthdate">
                          <aa-input-date (modelChange)="validateAge($event)" [(ngModel)]="birthDate" class="aa-qq-aov__input" [setFocus]="setFocus"></aa-input-date>
                        </div>
                        
                        <button class="arrow button" type="button" (click)="submitDob()" [disabled]="isAgeValid">Volgende vraag</button>
                        
                      </div>
                      <div class="col form-text__column">
                          <h2>Sidebar</h2>
                          <p>Subscribe to the newsletter!</p>
                      </div>
                  </div>
              </div>
          </div>
        </div>
      </li>
      <li class='number-form__list__section'>
        <span class="number-form__list__numberCircle">4</span>
        <span class="general-form__box__sub__header">Partnerpensioen meeverzekeren?</span>
        
        <div [@visibility]="editVisibility4(visibility.four)"> 
          <div style="padding: 10px 30px 10px 20px; background-color:#D9EBF7; border-radius: 5px;">
            <span>€ {{pensionAmount}}</span>
            <span style="float: right; cursor:pointer;" (click)="editSection('box4')"> > Aanpassen</span>
          </div>
        </div>
       
        <div [@visibility]="visibility.four"> 
          <p>Heeft u een partner? En wilt u dat uw partner een pensioenuitkering krijgt na uw overlijden? Dan kunt u een partnerpensioen verzekeren. De uitkering is 70% van het pensioen dat u ontvangt.</p>
          <div class="form-element-text__row">
              <div class="table">
                  <div class="row">
                      <div class="col form-element__column">
                      
                        <span class="general-form__box__head">Heeft u een partner?</span>
                        <div class="white-radio-wrapper">
                          <label class="radio white-radio">
                            <input type="radio" name="aov.who" value="Aegon" [(ngModel)]="whofor" (change)="partnerDob = 'show'" />
                            <span class="radio"></span>
                            <span class="label-text">Ja, ik heb een partner</span>
                          </label>
                        
                          <label class="radio white-radio">
                            <input type="radio" name="aov.who" value="Andere verzekeraar(s) of pensioenfonds(en)" [(ngModel)]="whofor" (change)="partnerDob = 'hidden'" />
                            <span class="radio"></span>
                            <span class="label-text">Nee, ik heb geen partner</span>
                          </label>
                        </div>
                        
                        <div [@visibility]="partnerDob">
                          <span class="general-form__box__head">Wilt u een partnerpensioen voor uw partner verzekeren?</span>
                          <div class="white-radio-wrapper">
                            <label class="radio white-radio extended-text">
                              <input type="radio" name="aov.partner" value="Aegon" [(ngModel)]="pensionLocation" />
                              <span class="radio"></span>
                              <span class="label-text"><strong>Ja, ik wil een partnerpensioen verzekeren</strong></span>
                              <span class="label-text">bij mijn overlijden ontvangt mijn partner 70% van het <br> pensioen dat ik zelf ontvang</span>
                            </label>
                          
                            <label class="radio white-radio extended-text">
                              <input type="radio" name="aov.partner" value="Andere verzekeraar(s) of pensioenfonds(en)" [(ngModel)]="pensionLocation" />
                              <span class="radio"></span>
                              <span class="label-text"><strong>Nee, ik wil geen partnerpensioen verzekeren</strong></span>
                              <span class="label-text">bij mijn overlijden ontvangt mijn partner geen <br> partnerpensioen. Hier moet uw partner schriftelijk mee <br> instemmen</span>
                            </label>
                          </div>              
                             
                             
                          <span class="general-form__box__head">Uw geboortedatum</span>
                          
                          <div class="inputs birthdate">
                            <aa-input-date (modelChange)="validateAge($event)" [(ngModel)]="birthDate" class="aa-qq-aov__input" [setFocus]="setFocus"></aa-input-date>
                          </div>
                        </div>
                        
                        <button class="arrow button" type="button" (click)="submitUserPartnerDob()" [disabled]="isAgeValid">Volgende vraag</button>
                      </div>
                      <div class="col form-text__column">
                          <h2>Sidebar</h2>
                          <p>Subscribe to the newsletter!</p>
                      </div>
                  </div>
              </div>
          </div>
        </div>
      </li>
      <li class='number-form__list__section'>
        <span class="number-form__list__numberCircle">5</span>
        <span class="general-form__box__sub__header">Wanneer wilt u de pensioenverzekering laten ingaan?</span>
        
        <div [@visibility]="editVisibility5(visibility.five)"> 
          <div style="padding: 10px 30px 10px 20px; background-color:#D9EBF7; border-radius: 5px;">
            <span>€ {{pensionAmount}}</span>
            <span style="float: right; cursor:pointer;" (click)="editSection('box5')"> > Aanpassen</span>
          </div>
        </div>
       
        <div [@visibility]="visibility.five"> 
          <p>Hier uitleggen waarom je een bepaalde datum zou kiezen en wat het voordeel is om bijvoorbeeld later te beginnen met uitkeren dan direct op je pensioenleeftijd.</p>
          <div class="form-element-text__row">
              <div class="table">
                  <div class="row">
                      <div class="col form-element__column">
                        <span class="general-form__box__head">Ingangsdatum van uw pensioenverzekering</span>
                        <p>De ingangsdatum van uw pensioen is altijd per de 1ste van de maand. De pensioenuitkering ontvangt u dan niet direct. die ontvangt u altijd aan het einde van de maand (rond de 25ste).</p>
                          
                        <div class="inputs select">
                          <select #mortgageSelect [(ngModel)]="mortgageType" class="no-dd" (change)="init($event.target.value);">
                            <option [value]="0" selected>first</option>
                            <option [value]="1">second</option>
                            <option [value]="2">third</option>
                            <option [value]="3">fourth</option>
                            <option [value]="4">fifth</option>
                            <option [value]="5">sixth</option>
                          </select>
                        </div>
                        
                        <button class="arrow button" type="button" (click)="submitFinal()" [disabled]="isValidAmount()">Volgende vraag</button>
                        
                      </div>
                      <div class="col form-text__column">
                          <h2>Sidebar</h2>
                          <p>Subscribe to the newsletter!</p>
                      </div>
                  </div>
              </div>
          </div>
        </div>
      </li>
    </ul>
    
   <!-- <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div *ngIf="first.invalid"> Name is too short. </div>
      <input formControlName="first" placeholder="First name">
      <input formControlName="last" placeholder="Last name">
      <button type="submit">Submit</button>
   </form>
   
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div *ngIf="first.invalid"> Name is too short. </div>
      <input formControlName="third" placeholder="third name">
      <input formControlName="fourth" placeholder="fourth name">
      <button type="submit">Submit</button>
   </form> -->
    
`;
