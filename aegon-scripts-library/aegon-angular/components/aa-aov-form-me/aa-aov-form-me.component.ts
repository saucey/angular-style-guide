/**
 * Help/hint component. Fully css based; angular only acts as a html template
 * For now only .hint--bottom-left positioning works.
 * @input {String} Text to display in the popup
 * @input {String} position Position relative to the cursor to position the hint
 * - Currently only bottom-left is supported
 */
import {Component, ElementRef, OnInit, EventEmitter} from "@angular/core";
import {template} from "./template";


@Component({
  selector: 'aa-aov-form-me',
  template: template,
  outputs: ['smoker', 'birth']
})

export class AAAovFormMeComponent {

  public  birthDate: string;
  public dobis: any;
  public smokeris: any;

  constructor(private elementRef:ElementRef) {}

  smoker = new EventEmitter<string>();
  birth = new EventEmitter<string>();

  isSmoker(value: string) {
    this.dobis = this.smoker.emit(value);
  }

  dob(value: string) {
    this.smokeris = this.birth.emit(value);
  }

  save(){
    console.log(this.dobis, 'this is save');
    console.log(this.smokeris, 'the is save');

    //close the parent blue box
    //store the data

  }

  ngOnInit() {

  }
}
