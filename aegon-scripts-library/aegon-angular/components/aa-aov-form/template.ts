export const template = `
<div class="aov-form quickquote angular aov-quote">
    <section class="personal-details">

        <h1>Stel uw verzekering samen</h1>
        <h2>Uw situatie: Uw overlijidensrisicoverzekering koppelen aan uw hypotheek</h2>
        <ul class='aov-form__list'>
            <li class='aov-form__section'>
                <span class="aov-form__numberCircle">1</span>

                <div class="the-submitted">

                </div>

                <div class="form">
                    <h2>Wie wilt u verzekeren?</h2> 
                    <p>Hier uitleggen waarom en in welke situatie ik wat moet kiezen?</p>

                    <div class='aov-form__box'>
                        <p class="main-color">Wie wilt u verzekeren?</p>
                        <div class=" aov-form__selection">
                            <label class="radio">
                                <input type="radio" name="aov.person" value="Mezelf" [ngModel]="{checked: !collapsed1}" (change)="coll('box1')" />
                                <span class="radio"></span>
                                <div class="aov-form__radio__text">
                                    <p><strong>Mezelf</strong>
                                    </p>
                                    <p>Hier tekst waarom ik alleen mezelf zou kiezen en niet een ander of allebei, in welke situatie moet ik wat kiezen?</p>
                                </div>
                            </label>
                        </div>

                        <div class=" aov-form__selection">
                            <label class="radio">
                                <input type="radio" name="aov.person" value="Een ander" [ngModel]="{checked: !collapsed2}" (change)="coll('box2')" />
                                <span class="radio"></span>
                                <div class="aov-form__radio__text">
                                    <p><strong>Een ander</strong>
                                    </p>
                                    <p>Hier tekst waarom ik een ander zou kiezen en mezelf of allebei. in welke situatie moet ik wat kiezen?</p>
                                </div>
                            </label>
                        </div>

                        <div class=" aov-form__selection">
                            <label class="radio">
                                <input type="radio" name="aov.person" value="Mezelf en een andre" [ngModel]="{checked: !collapsed3}" (change)="coll('box3')" />
                                <span class="radio"></span>
                                <div class="aov-form__radio__text">
                                    <p><strong>Mezelf en een andre</strong>
                                    </p>
                                    <p>Hier tekst waarom ik ditczou kiezen en niet alleen een andre of ezelf. In welke situatie moet ik wat kiezen?</p>
                                </div>
                            </label>
                        </div>

                        <div class="my-box" [aa-collapse]="collapsed1" [duration]="duration">
                            <aa-aov-form-me (birth)="birthDayDate($event)" (smoker)="isSmoker($event)" [birthDate]="options.birthDate.help"></aa-aov-form-me>
                        </div>

                        <div class="my-box" [aa-collapse]="collapsed2" [duration]="duration">
                            <aa-aov-form-you [birthDate]="options.birthDate.help"></aa-aov-form-you>
                        </div>

                        <div class="my-box" [aa-collapse]="collapsed3" [duration]="duration">
                            <aa-aov-form-both [birthDate]="options.birthDate.help"></aa-aov-form-both>
                        </div>
                    </div>

                </div>
            </li>

            <li class="aov-form__section">
                <span class="aov-form__numberCircle">2</span>

                <div class="main">
                    <h2>Wanneer wilt u de verzekering laten ingaan?</h2>
                    <p>Hier tekst waarom en in welke situatie moet ik wat kiezen? Verzekering gaat altijd in per de eerste van de maand.</p>
                    <div class="container">
                        <div class="content">
                            <div class="inner-content">
                                <p>Ingangsmaand en jaar van uw verzekering</p>
                                <div class="quickquote angular boeterente">
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

                                <button class="arrow" disabled type="button" (click)="save(personInfo)">Volgende vraag</button>
                                
                            </div>
                        </div>
                        <div class="side">
                            <aside>
                              <h4>76% van ouders met kinderen kiest voor een looptijd van</h4>
                              <h3>20 jaar</h3>
                            </aside>
                        </div>
                    </div>
                    <!-- /.containter -->
                </div>
                <!-- /.main -->
            </li>
            <li class="aov-form__section">
                <span class="aov-form__numberCircle">3</span>

                <div class="main">
                    <h2>Hoe lang wilt u verzekerd zijn?</h2>
                    <p>Dit is de periode dat de verzekering loopt. Mocht u in deze periode overlijden, krijgt u het keuzebedrag uitgekeerd. Hier uitleggen wat de overwegingen zijn. Waarom langer / korter? Waar rekening mee houden? (Hoe lang moet u nog aflossen op uw hypotheek? Wanneer gaan de kinderen uit huis? Hoe staat u er over X jaar voor?)</p>
                    <div class="container">
                        <div class="content">
                            <div class="inner-content">
                                <p>Ingangsmaand en jaar van uw verzekering</p>
                                <div class="quickquote angular boeterente">
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

                                <button class="arrow" disabled type="button" (click)="save(personInfo)">Volgende vraag</button>
                                
                            </div>
                        </div>
                        <div class="side">
                            <aside>
                              <h2>76%</h2>
                              <h4>van ouders met kinderen kiest voor een looptijd van</h4>
                              <h3>20 jaar</h3>
                            </aside>
                        </div>
                    </div>
                    <!-- /.containter -->
                </div>
                <!-- /.main -->
            </li>
                        <li class="aov-form__section">
                <span class="aov-form__numberCircle">3</span>

                <div class="main">
                    <h2>Hoe lang wilt u verzekerd zijn?</h2>
                    <p>Dit is de periode dat de verzekering loopt. Mocht u in deze periode overlijden, krijgt u het keuzebedrag uitgekeerd. Hier uitleggen wat de overwegingen zijn. Waarom langer / korter? Waar rekening mee houden? (Hoe lang moet u nog aflossen op uw hypotheek? Wanneer gaan de kinderen uit huis? Hoe staat u er over X jaar voor?)</p>
                    <div class="container">
                        <div class="content">
                            <div class="inner-content">
                                <p>Ingangsmaand en jaar van uw verzekering</p>
                                  <div class="inputs slider">
                                    <aegon-slider (click)="submitAmount()" (change)="calculate()" prefix="€" [range]="{
                                      'min': [  200 ],
                                      '25%': [  1000 ],
                                      '50%': [ 2000 ],
                                      '75%': [  3000 ],
                                      'max': [ 7500 ]
                                    }" [initial]="2500" label="Inkomen" [(ngModel)]="incomeValue" >
                                    </aegon-slider>
                                  </div>

                                <button class="arrow" disabled type="button" (click)="save(personInfo)">Volgende vraag</button>
                                
                            </div>
                        </div>
                        <div class="side">
                            <aside>
                              <h2>76%</h2>
                              <h4>van ouders met kinderen kiest voor een looptijd van</h4>
                              <h3>20 jaar</h3>
                            </aside>
                        </div>
                    </div>
                    <!-- /.containter -->
                </div>
                <!-- /.main -->
            </li>
        </ul>
    </section>
</div>
`;
