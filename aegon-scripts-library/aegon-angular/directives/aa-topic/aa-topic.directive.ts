/**
 * aa-topic.directive.ts created on 10/11/16 10:31 AM.
 *
 * @description [To be completed]
 * @author Florian Popa <florian@webgenerals.com>
 */
import {Directive, ElementRef, Input} from '@angular/core';

@Directive({
    selector: '[aaTopic]'
})

export class AATopicDirective {

    private element: ElementRef;
    private searchPlaceholder: string = '<dekperc>Dekperc</dekperc>';

    @Input() topicText: any;

    constructor(el: ElementRef) {
        this.element = el;
    }

    ngOnInit() {
        const percentage = '70%';
        let text = this.topicText.text;
        let defaultPercentage = this.topicText.defaultPercentage;

        if (text.indexOf(this.searchPlaceholder, 0) != -1) {
            if (defaultPercentage === false) {
                text = this.replaceAll(text, this.searchPlaceholder, '');
            } else {
                text = this.replaceAll(text, this.searchPlaceholder, percentage);
            }
        }

        this.element.nativeElement.innerHTML = text;
    }

    private escapeRegExp(str) {
        return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }

    private replaceAll(str, find, replace) {
        return str.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
    }
}
