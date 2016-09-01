export const template = `
  <div class="aa-beleggen-test"
    [ngClass]="['aa-state--' + data.state, data.options.cssClass || '']">
    <div class="aa-beleggen-test__intro">
      <div class="aa-beleggen-test__header aa-text__color--white">
        {{ data.options.header }}
      </div>
      <div class="aa-beleggen-test__subheader aa-text__color--white">
        {{ data.options.subheader }}
      </div>
      <div class="aa-beleggen-test__action aa-text__color--white" (click)="reset()">
        <span *ngIf="!data.done">
          {{ data.options.action }}
        </span>
        <span *ngIf="data.done">
          {{ data.options.opnieuw }}
        </span>
      </div>
      <div class="aa-beleggen-test__image"
        [style.background-image]="'url(' + data.options.image + ')'">
      </div>
    </div>
    <div class="aa-beleggen-test__test">
      <div class="aa-beleggen-test__results aa-fade-in aa-layout__fill"
        [ngClass]="{'aa-beleggen-test__results--winner': data.tips.length === 0 }">
        <div class="aa-beleggen-test__title">
          {{ data.tips.length === 0 ? data.options.result.winner.title : (data.score + ' van de ' + data.countQuestions + ' vragen goed!') }}
        </div>
        <div class="aa-beleggen-test__result-text">
          {{ data.tips.length === 0 ? data.options.result.winner.text : data.options.result.text }}
        </div>
        <div class="aa-beleggen-test__tip-head">
          <div class="aa-beleggen-test__tip-label aa-beleggen-test__title">
            Tip {{ data.tips.length > 1 ? (data.tip + 1)  + ' van ' + data.tips.length : ''}}
          </div>
          <div class="aa-beleggen-test__tip-navs">
            <div class="aa-beleggen-test__tip-next aa-beleggen-test__tip-nav"
              (click)="nextTip()"
              *ngIf="data.tips.length > 1">
            </div>
          </div>
        </div>
        <div class="aa-layout__slides aa-beleggen-test__tips">
          <div class="aa-layout__slide aa-beleggen-test__tip"
            [ngStyle]="{'transform': 'translateX(-' + data.tip * 100 + '%)'}"
            *ngFor="#tip of data.tips; #i=index"
            (click)="nextTip()">
            <div class="aa-beleggen-test__tip-text"> {{ tip.tip }} </div>
          </div>
        </div>
        <div class="aa-layout__slides aa-beleggen-test__winner aa__overflowy">
          <div class="aa-layout__slide">
            <div class="aa-beleggen-test__check"
              *ngFor="#question of data.options.questions;">
              {{ question.check }}
            </div>
          </div>
        </div>
        <div class="aa-beleggen-test__cta">
          <a [attr.href]="data.options.cta.url" class="button orange icon-right arrow">{{ data.options.cta.text }} </a>
        </div>
      </div>

      <div class="aa-beleggen-test__nrs">
        <div class="aa-beleggen-test__nr"
          *ngFor="#question of data.options.questions; #i=index"
          [ngClass]="{
            'aa-beleggen-test__nr--active': data.question === i,
            'aa-beleggen-test__nr--completed': i <= data.lastQuestion
          }"
          (click)="gotoQuestion(i)">
          {{ i + 1}}
        </div>
      </div>
      <div class="aa-beleggen-test__question-box aa-layout__slides">
        <div class="aa-beleggen-test__question aa-layout__slide"
          [ngClass]="'aa-beleggen-test--q-' + data.question"
          [ngStyle]="{'transform': 'translateX(-' + data.question * 100 + '%)'}"
          *ngFor="#question of data.options.questions; #i=index">
          <div class="aa-beleggen-test__question-bubble">
            <div class="aa-beleggen-test__question-label">Vraag {{ i + 1 }}</div>
            <div class="aa-beleggen-test__question-text">
              {{ data.options.questions[i].q }}
            </div>
          </div>
        </div>
      </div>
      <div class="aa-beleggen-test__buttons"
        [ngClass]="{'aa-beleggen-test__buttons--clicked': data.justClicked === true || data.justClicked === false}">
        <button class="button aa-beleggen-test__button" (click)="answer(data.question, true)"
          [ngClass]="{'aa-beleggen-test__button--clicked': data.justClicked === true, 'aa-beleggen-test__button--answer': data.answers[data.question] === true}">
          Ja
        </button>
        <button class="button aa-beleggen-test__button" (click)="answer(data.question, false)"
          [ngClass]="{'aa-beleggen-test__button--clicked': data.justClicked === false, 'aa-beleggen-test__button--answer': data.answers[data.question] === false}">
          Nee
        </button>
      </div>
    </div>
  </div>
`;

