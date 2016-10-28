
import {Component, Input, Output, NgZone, ElementRef, ViewChild, EventEmitter} from '@angular/core';
import {template} from "./template";
import {AABaseComponent} from '../../lib/classes/AABaseComponent';
import {defaultOptions} from "./defaultOptions";
import {aegonTealium} from "../../lib/aegon_tealium";

declare var jQuery: any;


@Component({
  selector: 'aa-todos',
  template: template
})

export class AATodosComponent extends AABaseComponent {
  amountTodos: number = 0;
  blok1aantalTodosTotaal: number = 0;
  blok1aantalTodosChecked: number = 0;
  blok2aantalTodosTotaal: number = 0;
  blok2aantalTodosChecked: number = 0;
  blok3aantalTodosTotaal: number = 0;
  blok3aantalTodosChecked: number = 0;
  blok4aantalTodosTotaal: number = 0;
  blok4aantalTodosChecked: number = 0;


  public defaultOptions: any = defaultOptions;
  // Let parent class initialize config; the dependency injection with ElementRef
  // doesn't work directly so we have to call it explicitly.
  constructor(elementRef: ElementRef, private zone: NgZone) {
    super(elementRef);
  }

  ngOnInit(): void {
    super.ngOnInit();

    for (let i = 0; i < defaultOptions.questions1.length; ++i) {
      let q = defaultOptions.questions1[i];
      this.blok1aantalTodosTotaal = this.blok1aantalTodosTotaal + q.todos.length;
    } // for blok 1
    for (let i = 0; i < defaultOptions.questions2.length; ++i) {
      let q = defaultOptions.questions2[i];
      this.blok2aantalTodosTotaal = this.blok2aantalTodosTotaal + q.todos.length;
    } // for blok 2
    for (let i = 0; i < defaultOptions.questions3.length; ++i) {
      let q = defaultOptions.questions3[i];
      this.blok3aantalTodosTotaal = this.blok3aantalTodosTotaal + q.todos.length;
    } // for blok 3
    for (let i = 0; i < defaultOptions.questions4.length; ++i) {
      let q = defaultOptions.questions4[i];
      this.blok4aantalTodosTotaal = this.blok4aantalTodosTotaal + q.todos.length;
    } // for blok 4
  }

  setValue(checkboxName): boolean {
    for (let i = 0; i < defaultOptions.questions1.length; ++i) {
      let q = defaultOptions.questions1[i];
      for (let p = 0; p < q.todos.length; ++p) {
       let todo = q.todos[p];
       if (checkboxName.name === todo.code) {
        if (checkboxName.checked) {
          this.blok1aantalTodosChecked = this.blok1aantalTodosChecked + 1;
          } else {
          this.blok1aantalTodosChecked = this.blok1aantalTodosChecked - 1;
          } // end else
        }  // end if
       } //end loop todos for 1 question
    } //end loop question


    for (let i = 0; i < defaultOptions.questions2.length; ++i) {
      let q = defaultOptions.questions2[i];
      for (let p = 0; p < q.todos.length; ++p) {
        let todo = q.todos[p];
        if (checkboxName.name === todo.code) {
          if (checkboxName.checked) {
            this.blok2aantalTodosChecked = this.blok2aantalTodosChecked + 1;
          } else {
            this.blok2aantalTodosChecked = this.blok2aantalTodosChecked - 1;
          } // end else
        }  // end if
      } //end loop todos for 1 question
    } //end loop question


    for (let i = 0; i < defaultOptions.questions3.length; ++i) {
      let q = defaultOptions.questions3[i];
      for (let p = 0; p < q.todos.length; ++p) {
        let todo = q.todos[p];
        if (checkboxName.name === todo.code) {
          if (checkboxName.checked) {
            this.blok3aantalTodosChecked = this.blok3aantalTodosChecked + 1;
          } else {
            this.blok3aantalTodosChecked = this.blok3aantalTodosChecked - 1;
          } // end else
        }  // end if
      } //end loop todos for 1 question
    } //end loop question


    for (let i = 0; i < defaultOptions.questions4.length; ++i) {
      let q = defaultOptions.questions4[i];
      for (let p = 0; p < q.todos.length; ++p) {
        let todo = q.todos[p];
        if (checkboxName.name === todo.code) {
          if (checkboxName.checked) {
            this.blok4aantalTodosChecked = this.blok4aantalTodosChecked + 1;
          } else {
            this.blok4aantalTodosChecked = this.blok4aantalTodosChecked - 1;
          } // end else
        }  // end if
      } //end loop todos for 1 question
    } //end loop question


    return true;
  } // end setValue()
}
