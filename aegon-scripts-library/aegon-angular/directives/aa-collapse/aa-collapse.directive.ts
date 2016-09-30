import {Directive, ElementRef, Input, trigger, state, animate, transition, style} from '@angular/core';

// import {AnimationBuilder} from '@angular/src/animate/animation_builder';
// import {CssAnimationBuilder} from '@angular/src/animate/css_animation_builder';

@Directive({
  selector: '[aa-collapse]',
  host: {
    '[attr.aria-expanded]': '!collapse',
    '[attr.aria-hidden]': 'collapse'
  }
})

export class AACollapseDirective {


  constructor(private _element:ElementRef) {
    // this._animation = animationBuilder.css();
    console.log(this._element.nativeElement.scrollHeight,'in my directive');
    return;
  }

  return;

  // ngOnChanges(changes) {
  //   if (changes.collapse) {
  //     if (this.collapse) {
  //       this.hide()
  //     } else {
  //       this.show();
  //     }
  //   }
  // }

  // hide(): void {
  //   this._baseSequence
  //     .setFromStyles({
  //       height: this._element.nativeElement.scrollHeight + 'px',
  //       overflow: 'hidden'
  //     })
  //     .setToStyles({
  //       height: '0',
  //       paddingTop: '0',
  //       paddingBottom: '0'
  //     });
  //
  //   let a = this._animation.start(this._element.nativeElement);
  //   a.onComplete(() => {
  //     a.removeClasses(['in']); // rapid change will leave in
  //     a.addClasses(['collapse']);
  //   });
  // }
  //
  // show(): void {
  //   this._animation
  //     .setDuration(0)
  //     .addClass('in')
  //     .setFromStyles({
  //       overflow: 'hidden'
  //     })
  //     .setToStyles({
  //       paddingTop: '',
  //       paddingBottom: ''
  //     })
  //     .start(this._element.nativeElement)
  //     .onComplete(() => {
  //       let a = this._baseSequence
  //         .setFromStyles({
  //           height: '0'
  //         })
  //         .setToStyles({
  //           height: this._element.nativeElement.scrollHeight + 'px'
  //         })
  //         .start(this._element.nativeElement);
  //
  //       a.onComplete(() =>  a.addClasses(['collapse', 'in'])  );
  //     });
  // }
  //
  // private get _elementHeight(): number {
  //   let el = this._element.nativeElement;
  //   var height = el.offsetHeight;
  //   var style = getComputedStyle(el);
  //
  //   height += parseInt(style.marginTop) + parseInt(style.marginBottom);
  //   return height;
  // }
  //
  // private get _baseSequence(): CssAnimationBuilder {
  //   return this._animation
  //     .setDuration(this.duration)
  //     .removeClass('collapse')
  //     .removeClass('in')
  //     .addAnimationClass('collapsing')
  // }
}
