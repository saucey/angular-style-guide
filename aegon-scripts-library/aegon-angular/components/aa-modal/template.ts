export const template = `
  <div template="ngIf visible" (keypress)="keypress($event)" aaAppend="body">
    <div class="aa-modal" [ngClass]="{'aa-modal--actions': data.options.actions, 'aa-modal--closing': closing}">
      <div class="aa-modal__bg" (click)="bgClick()"></div>
      <div class="aa-modal__dialog-width" [ngStyle]="{width: data.options.width || 'inherit'}">
        <div class="aa-modal__title">{{ data.options.title }} </div>
        <a class="aa-modal__close" (click)="close()" template="ngIf data.options.close"></a>
        <div class="aa-modal__actions">
          <ng-content select="aa-modal-actions"></ng-content>
        </div>
        <div class="aa-modal__dialog-height" [ngStyle]="{height: data.options.height || 'inherit'}">
          <div class="aa-modal__content">
            <ng-content select="aa-modal-content"></ng-content>
          </div>
        </div>
      </div>
    </div>
  </div>
`;