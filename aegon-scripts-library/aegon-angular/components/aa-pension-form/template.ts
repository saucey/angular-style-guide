export const template = `
<h1>Stel uw pensioenproduction samen</h1>
<h2 class="sub-header">Uw situatie: u gaat binnenkort met pensioen</h2>

    <ul class="number-form__list">
      <li class='number-form__list__section'>
        <span class="number-form__list__numberCircle">1</span>
        <span class="sub-header">Uw pensioenkapitaal</span>
        <div [@visibility]="visibility.one == 'show' ? 'hidden' : 'show'"> 
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
                        <span class="head">Hoogte van uw pensoenkapitaal</span>
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
                        
                        <button class="arrow button" type="button" *ngIf="step === 1" (click)="submitAmount()" [disabled]="isValidAmount()">Volgende vraag</button>
                        
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
        <span class="sub-header">Waar is uw pensioenkapitaal opgebouwd</span>
        
        <div [@visibility]="visibility.two"> 
          <p>Om het juiste rendement te kunnen tonen dient u hier in te vullen bij welke verzekeraars of pensioenfondsen uw pensioen is opgebouwd.</p>
          <div class="form-element-text__row">
              <div class="table">
                  <div class="row">
                      <div class="col form-element__column">
                        <span>Hoogle van uw pensioenkapitaal</span>
                        <span>Hoogle van uw pensioenkapitaal</span>
                        <span>Hoogle van uw pensioenkapitaal</span>
                        <span>Hoogle van uw pensioenkapitaal</span>
                        <span>Hoogle van uw pensioenkapitaal</span>
                        <span>Hoogle van uw pensioenkapitaal</span>
                        <span>Hoogle van uw pensioenkapitaal</span>
                        <span>Hoogle van uw pensioenkapitaal</span>
                        <span>Hoogle van uw pensioenkapitaal</span>
                        <span>Hoogle van uw pensioenkapitaal</span>
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
        <span class="number-form__list__numberCircle">3</span>
        <span class="sub-header">Persoonlijke gegevens</span>
        
        <div [@visibility]="visibility.three">
          <p>Om uw pensioenuitkering exact uit te rekenen hebben we uw geboortedatum nodig</p>
          <div class="form-element-text__row">
              <div class="table">
                  <div class="row">
                      <div class="col form-element__column">
                        <span>Hoogle van uw pensioenkapitaal</span>
                        <span>Hoogle van uw pensioenkapitaal</span>
                        <span>Hoogle van uw pensioenkapitaal</span>
                        <span>Hoogle van uw pensioenkapitaal</span>
                        <span>Hoogle van uw pensioenkapitaal</span>
                        <span>Hoogle van uw pensioenkapitaal</span>
                        <span>Hoogle van uw pensioenkapitaal</span>
                        <span>Hoogle van uw pensioenkapitaal</span>
                        <span>Hoogle van uw pensioenkapitaal</span>
                        <span>Hoogle van uw pensioenkapitaal</span>
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
    
    <button (click)="coll('box1')">one</button>
    <button (click)="coll('box2')">two</button>
    <button (click)="coll('box3')">three</button>

    {{visibility.one}}
    {{visibility.two}}
    {{visibility.three}}
    
    <div [@visibility]="visibility.one">
      <div style="background-color: red; padding: 20px; box-sizing: border-box;">
        <p>Animate good times! box1 Come on!</p>
        <p>Animate good times! box1 Come on!</p>
        <p>Animate good times! box1 Come on!</p>
        <p>Animate good times! box1 Come on!</p>
      </div>
    </div>
    
    <div [@visibility]="visibility.two">
      <div style="background-color:  green; padding: 20px; box-sizing: border-box;">
        Animate good times! box1 Come on!
      </div>
    </div>
    
    <div [@visibility]="visibility.three">
      <div style="background-color:  blue; padding: 20px; box-sizing: border-box;">
        Animate good times! box1 Come on!
      </div>
    </div>
    
     <form [formGroup]="form" (ngSubmit)="onSubmit()">
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
   </form>
    
`;
