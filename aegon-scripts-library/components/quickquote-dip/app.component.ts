import {Component} from 'angular2/core';
//import {InputMoney} from './input-money.ts';

@Component({
    selector: 'aegon-quickquote-dip',
    //directives: [InputMoney],
    template: `
<div class="quickquote lijfrente sparen">
    <div class="triangle"></div>
    <div class="calculation">
        <h3>Bereken direct uw pensioenuitkering</h3>
        Beschikbaar pensioenkapitaal
        <input type="text">
        <!--input-money currency="€" ([ngModel])="availableMoney"></input-money-->
        <div *ngIf="step >= 2">
            Stap 2!
        </div>
        <div *ngIf="step >= 3">
            Stap 3!
        </div>
        <div *ngIf="step >= 4">
            Stap 4!
        </div>
        <div *ngIf="step >= 5">
            OMG So Many Steps ({{step}})!!!
        </div>
        <button class="button arrow" (click)="step = step + 1 || 2">
            Volgende
        </button>
        
    </div>
</div>
`
})
export class AppComponent {}
