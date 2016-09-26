export const template = `
  <div class="aa-quiz"
    [ngClass]="['aa-state--' + data.state, data.options.cssClass || '']">
    <div class="aa-quiz__intro">
      <div class="aa-quiz__header aa-text__color--white">
        {{ data.options.header }}
      </div>
      <div class="aa-quiz__subheader aa-text__color--white">
        {{ data.options.subheader }}
      </div>
      <div class="aa-quiz__action aa-text__color--white" (click)="reset()">
        <span *ngIf="!data.done">
          {{ data.options.action }}
        </span>
        <span *ngIf="data.done">
          {{ data.options.opnieuw }}
        </span>
      </div>
      <div class="aa-quiz__image"
        [style.background-image]="'url(' + data.options.image + ')'">
      </div>
    </div>
    <div class="aa-quiz__test">
      <div class="aa-quiz__results aa-fade-in aa-layout__fill"
        [ngClass]="{'aa-quiz__results--winner': data.tips.length === 0 }">
        <div class="aa-quiz__title">
          {{ data.tips.length === 0 ? data.options.result.winner.title : (data.score + ' van de ' + data.options.questions.length + ' vragen goed!') }}
        </div>
        <div class="aa-quiz__result-text">
          {{ data.tips.length === 0 ? data.options.result.winner.text : data.options.result.text }}
        </div>
        <div class="aa-quiz__tip-head">
          <div class="aa-quiz__tip-label aa-quiz__title">
            Tip {{ data.tips.length > 1 ? (data.tip + 1)  + ' van ' + data.tips.length : ''}}
          </div>
          <div class="aa-quiz__tip-navs">
            <div class="aa-quiz__tip-next aa-quiz__tip-nav"
              (click)="nextTip()"
              *ngIf="data.tips.length > 1">
            </div>
          </div>
        </div>
        <div class="aa-layout__slides aa-quiz__tips">
          <div class="aa-layout__slide aa-quiz__tip"
            [ngStyle]="{'transform': 'translateX(-' + data.tip * 100 + '%)'}"
            *ngFor="let tip of data.tips; #i=index"
            (click)="nextTip()">
            <div class="aa-quiz__tip-text"> {{ tip.tip }} </div>
          </div>
        </div>
        <div class="aa-layout__slides aa-quiz__winner aa__overflowy">
          <div class="aa-layout__slide">
            <div class="aa-quiz__check"
              *ngFor="let question of data.options.questions;">
              {{ question.check }}
            </div>
          </div>
        </div>
        <div class="aa-quiz__cta">
          <a [attr.href]="data.options.cta.url" class="button orange icon-right arrow">{{ data.options.cta.text }} </a>
        </div>
      </div>

      <div class="aa-quiz__nrs">
        <div class="aa-quiz__nr"
          *ngFor="let question of data.options.questions; #i=index"
          [ngClass]="{
            'aa-quiz__nr--active': data.question === i,
            'aa-quiz__nr--completed': i <= data.lastQuestion
          }"
          (click)="gotoQuestion(i)">
          {{ i + 1}}
        </div>
      </div>
      <div class="aa-quiz__question-box aa-layout__slides">
        <div class="aa-quiz__question aa-layout__slide"
          [ngClass]="'aa-quiz--q-' + data.question"
          [ngStyle]="{'transform': 'translateX(-' + data.question * 100 + '%)'}"
          *ngFor="let question of data.options.questions; #i=index">
          <div class="aa-quiz__question-bubble">
            <div class="aa-quiz__question-label">Vraag {{ i + 1 }}</div>
            <div class="aa-quiz__question-text">
              {{ data.options.questions[i].q }}
            </div>
          </div>
        </div>
      </div>
      <div class="aa-quiz__buttons"
        [ngClass]="{'aa-quiz__buttons--clicked': data.justClicked === true || data.justClicked === false}">
        <button class="button aa-quiz__button" (click)="answer(data.question, true)"
          [ngClass]="{'aa-quiz__button--clicked': data.justClicked === true, 'aa-quiz__button--answer': data.answers[data.question] === true}">
          Ja
        </button>
        <button class="button aa-quiz__button" (click)="answer(data.question, false)"
          [ngClass]="{'aa-quiz__button--clicked': data.justClicked === false, 'aa-quiz__button--answer': data.answers[data.question] === false}">
          Nee
        </button>
      </div>
    </div>
  </div>
`;

