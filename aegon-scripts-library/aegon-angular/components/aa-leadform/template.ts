export const template = `
  <div class="aa-leadform" #root
    [ngClass]="['aa-state--' + data.state, data.options.cssClass || '']">
    <div class="aa-leadform__intro"
      [style.background-image]="'url(' + data.options.image + ')'">
      <div class="aa-leadform__header aa-text__shadow--white">
        {{ data.options.header }}
      </div>
      <div class="aa-leadform__subheader aa-text__shadow--white">
        {{ data.options.subheader }}
      </div>
    </div>
    <div class="aa-leadform__form">
      <div class="aa-leadform__loading aa-fade-in aa-layout__fill">
        <div class="aa-loading" aa-loading-text="ff wachten..."></div>
      </div>
      <div class="aa-leadform__thanks aa-fade-in aa-layout__fill">
        <div class="aa-leadform__title">
          {{ data.options.thanks.title }}
        </div>
        <p> {{ data.options.thanks.line1 }} </p>
        <p> {{ data.options.thanks.line2 }} </p>
        <a [attr.href]="data.options.download.url" class="aa-leadform__thanks-button button orange icon-right arrow">
          {{ data.options.download.text }}
        </a>
      </div>
      <div class="aa-leadform__title">
        {{ data.options.title }}
      </div>
      <form #form="ngForm" (ngSubmit)="onSubmit()" novalidate="novalidate">
        <div class="aa-leadform__line">
          <label class="radio aa-radio aa-leadform__aanhef">
          	<input class="aa-leadform__aanhef-m" type="radio" name="aanhef" required [attr.value]="data.options.form.fields.aanhef.dhr"/>
          	<span class="radio aa-radio__radio"></span>
          	<span class="aa-radio__text">
          	  {{ data.options.form.fields.aanhef.dhr }}
        	  </span>
          </label>
          <label class="radio aa-radio aa-leadform__aanhef">
          	<input class="aa-leadform__aanhef-f" type="radio" name="aanhef" checked [attr.value]="data.options.form.fields.aanhef.mevr"/>
          	<span class="radio aa-radio__radio"></span>
          	<span class="aa-radio__text">
          	  {{ data.options.form.fields.aanhef.mevr }}
        	  </span>
          </label>
        </div>
        <div class="aa-leadform__line">
          <input ngControl="voorletters" [(ngModel)]="data.form.voorletters" type="text" required [attr.placeholder]="data.options.form.fields.voorletters.placeholder" class="aa-leadform__voorletters aa-leadform__sep">
          <input type="text" [(ngModel)]="data.form.tussenvoegsel" [attr.placeholder]="data.options.form.fields.tussenvoegsel.placeholder"  class="aa-leadform__tussenvoegsel aa-leadform__sep">
        </div>

        <div class="aa-leadform__line aa-leadform__sep">
          <input ngControl="achternaam" [(ngModel)]="data.form.achternaam" type="text" required [attr.placeholder]="data.options.form.fields.achternaam.placeholder" class="aa-leadform__achternaam">
        </div>

        <div class="aa-leadform__line aa-leadform__sep">
          <input ngControl="email" [(ngModel)]="data.form.email" type="email" required pattern="[^ @]*@[^ @]+" [attr.placeholder]="data.options.form.fields.email.placeholder" class="aa-leadform__email">
        </div>

        <div class="aa-leadform__line aa-leadform__terms">
          {{ data.options.disclaimer }}
        </div>

        <div class="aa-leadform__line aa-leadform__cta">
          <button class="button orange icon-right arrow" type="submit" [disabled]="!form.valid">
            {{ data.options.button }}
          </button>
        </div>
      </form>
    </div>
  </div>
`;