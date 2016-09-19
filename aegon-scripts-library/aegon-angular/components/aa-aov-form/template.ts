export const template = `
  <div class="aov-form quickquote angular aov-quote">

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
            <input type="radio"  name="radio" value="me" [ngModel]="{checked: type.person == 'me'}" (change)="me = !me"/>
            <span class="radio"></span>
            <div class="aov-form__radio__text">
              <p><strong>Mezelf</strong></p>
              <p>Hier tekst waarom ik alleen mezelf zou kiezen en niet een ander of allebei, in welke situatie moet ik wat kiezen?</p>
            </div>
          </label>
        </div>

        <div class=" aov-form__selection">
          <label class="radio">
            <input type="radio" name="radio" value="you" [ngModel]="{checked: type.person == 'you'}" (click)="you = !you"/>
            <span class="radio"></span>
            <div class="aov-form__radio__text">
              <p><strong>Een ander</strong></p>
              <p>Hier tekst waarom ik een ander zou kiezen en mezelf of allebei. in welke situatie moet ik wat kiezen?</p>
            </div>
          </label>
        </div>

        <div class=" aov-form__selection">
          <label class="radio">
            <input type="radio" name="radio" value="meyou" [ngModel]="{checked: type.person == 'meyou'}" (click)="show('meyou')"/>
            <span class="radio"></span>
            <div class="aov-form__radio__text">
              <p><strong>Mezelf en een andre</strong></p>
              <p>Hier tekst waarom ik ditczou kiezen en niet alleen een andre of ezelf. In welke situatie moet ik wat kiezen?</p>
            </div>
          </label>
        </div>

        <button (click)="press = !press">toggle class</button>
        
        
        <div [ngClass]="{'transition': me}" class="aov-form__personTypeWrapper">
        
          <aa-aov-form-me [birthDate]="options.birthDate.help"></aa-aov-form-me>
        
        </div>
        <div [ngClass]="{'transition': you}" class="aov-form__personTypeWrapper">
        
          <aa-aov-form-me [birthDate]="options.birthDate.help"></aa-aov-form-me>
        
        </div>
        
        <button (click)="coll('box1')">First Toggle Collapse1</button>
        <button (click)="coll('box2')">Second Toggle Collapse2</button>
        <button (click)="coll('box3')">Third Toggle Collapse3</button>
        
        <div class="my-box" [collapse]="collapsed1" [duration]="duration">
          <h4>first toggle slide</h4>
          <h4>first toggle slide</h4>
          <h4>first toggle slide</h4>
          <h4>first toggle slide</h4>
          <h4>first toggle slide</h4>
          <h4>first toggle slide</h4>
        </div>
        
        <div class="my-box" [collapse]="collapsed2" [duration]="duration">
          <h4>second toggle slide</h4>
          <h4>second toggle slide</h4>
          <h4>second toggle slide</h4>
          <h4>second toggle slide</h4>
          <h4>second toggle slide</h4>
          <h4>second toggle slide</h4>
        </div>
        
        <div class="my-box" [collapse]="collapsed3" [duration]="duration">
          <h4>third toggle slide</h4>
          <h4>third toggle slide</h4>
          <h4>third toggle slide</h4>
          <h4>third toggle slide</h4>
          <h4>third toggle slide</h4>
          <h4>third toggle slide</h4>
        </div>
        
      </div>
    </li>
  </ul>
</section>

</div>

`;
