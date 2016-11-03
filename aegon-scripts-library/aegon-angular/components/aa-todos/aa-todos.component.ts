
import {Component, Input, Output, NgZone, OnInit, ElementRef, ViewChild, EventEmitter} from '@angular/core';
import {template} from "./template";
import {AABaseComponent} from '../../lib/classes/AABaseComponent';
import {defaultOptions} from "./defaultOptions";
import * as libDom from "../../lib/dom";
import {aegonTealium} from "../../lib/aegon_tealium";

declare var jQuery: any;


@Component({
  selector: 'aa-todos',
  template: template
})

export class AATodosComponent extends AABaseComponent {
  @Input() options: any = {};
  @Input() data: any = {};
  public defaultOptions : any = defaultOptions;
  public questions: any;
  private answerTimeout: any;

  amountTodos: number = 0;
  blok1aantalTodosTotaal: number = 0;
  blok1aantalTodosChecked: number = 0;
  blok2aantalTodosTotaal: number = 0;
  blok2aantalTodosChecked: number = 0;
  blok2visible: boolean = false;
  blok3aantalTodosTotaal: number = 0;
  blok3aantalTodosChecked: number = 0;
  blok3visible: boolean = false;
  blok4aantalTodosTotaal: number = 0;
  blok4aantalTodosChecked: number = 0;
  blok4visible: boolean = false;

  public blok1questions : any ;
  public blok2questions : any ;
  public blok3questions : any;
  public blok4questions : any;


  // Let parent class initialize config; the dependency injection with ElementRef
  // doesn't work directly so we have to call it explicitly.
  constructor(elementRef: ElementRef, private zone: NgZone) {
    super(elementRef);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.blok1questions = this.getBlok1Questions();
    this.blok2questions = this.getBlok2Questions();
    this.blok3questions = this.getBlok3Questions();
    this.blok4questions = this.getBlok4Questions();

  }

  setValue(checkboxName): boolean {
    for (let i = 0; i < this.blok1questions.length; ++i) {
      let q = this.blok1questions[i];
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


    for (let i = 0; i < this.blok2questions.length; ++i) {
      let q = this.blok2questions[i];
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


    for (let i = 0; i < this.blok3questions.length; ++i) {
      let q = this.blok3questions[i];
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


    for (let i = 0; i < this.blok4questions.length; ++i) {
      let q = this.blok4questions[i];
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

  getBlok2Visible(): boolean{
    // visible or not
    if(this.options.blok2title == null) {
      this.blok2visible = false;
    } else {
      return true;
    }
  }
  getBlok3Visible(): boolean{
    // visible or not
    if(this.options.blok3title == null) {
      this.blok3visible = false;
    } else {
      return true;
    }
  }
  getBlok4Visible(): boolean{
    // visible or not
    if(this.options.blok4title == null) {
      this.blok3visible = false;
    } else {
      return true;
    }
  }

  getBlok1Questions(): any {
    //build array
    let questions: any = []
    let question: any;
    let todos: any = [];
    let todo: any;
    let s: any;
    let c: any;
    let t: any;

    // start of question
    if (this.options.b1q1title == null) {
    } else {
      t = this.options.b1q1title;
      s = this.options.b1q1t1name1;
      if (s == null) {
      } else {
        c = 'blok1q1todo1';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b1q1t1name2;
      if (s == null) {
      } else {
        c = 'blok1q1todo2';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b1q1t1name3;
      if (s == null) {
      } else {
        c = 'blok1q1todo3';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b1q1t1name4;
      if (s == null) {
      } else {
        c = 'blok1q1todo4';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b1q1t1name5;
      if (s == null) {
      } else {
        c = 'blok1q1todo5';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      question = {title: t, todos: todos};
      questions.push(question);
      //end of question
    }
    // start of question
    question = [];
    todo = [];
    todos = [];
    if (this.options.b1q2title == null) {
    } else {
      t = this.options.b1q2title;
      s = this.options.b1q2t1name1;
      if (s == null) {
      } else {
        c = 'blok1q2todo1';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b1q2t1name2;
      if (s == null) {
      } else {
        c = 'blok1q2todo2';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b1q2t1name3;
      if (s == null) {
      } else {
        c = 'blok1q2todo3';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b1q2t1name4;
      if (s == null) {
      } else {
        c = 'blok1q2todo4';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b1q2t1name5;
      if (s == null) {
      } else {
        c = 'blok1q2todo5';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      question = {title: t, todos: todos};
      questions.push(question);
      //end of question
    }
    // start of question
    question = [];
    todo = [];
    todos = [];
    if (this.options.b1q3title == null) {
    } else {
      t = this.options.b1q3title;
      s = this.options.b1q3t1name1;
      if (s == null) {
      } else {
        c = 'blok1q3todo1';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b1q3t1name2;
      if (s == null) {
      } else {
        c = 'blok1q3todo2';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b1q3t1name3;
      if (s == null) {
      } else {
        c = 'blok1q3todo3';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b1q3t1name4;
      if (s == null) {
      } else {
        c = 'blok1q3todo4';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b1q3t1name5;
      if (s == null) {
      } else {
        c = 'blok1q3todo5';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      question = {title: t, todos: todos};
      questions.push(question);
      //end of question
    }
    // start of question
    question = [];
    todo = [];
    todos = [];
    if (this.options.b1q4title == null) {
    } else {

      t = this.options.b1q4title;
      s = this.options.b1q4t1name1;
      if (s == null) {
      } else {
        c = 'blok1q4todo1';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b1q4t1name2;
      if (s == null) {
      } else {
        c = 'blok1q4todo2';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b1q4t1name3;
      if (s == null) {
      } else {
        c = 'blok1q4todo3';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b1q4t1name4;
      if (s == null) {
      } else {
        c = 'blok1q4todo4';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b1q4t1name5;
      if (s == null) {
      } else {
        c = 'blok1q4todo5';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      question = {title: t, todos: todos};
      questions.push(question);
      //end of question
    }


    // start of question
    question = [];
    todo = [];
    todos = [];
    if (this.options.b1q5title == null) {
    } else {

    t = this.options.b1q5title;
    s = this.options.b1q5t1name1;
    if (s == null) {
    } else {
      c = 'blok1q5todo1';
      todo = {name: s, code: c};
      todos.push(todo);
    }
    s = this.options.b1q5t1name2;
    if (s == null) {
    } else {
      c = 'blok1q5todo2';
      todo = {name: s, code: c};
      todos.push(todo);
    }
    s = this.options.b1q5t1name3;
    if (s == null) {
    } else {
      c = 'blok1q5todo3';
      todo = {name: s, code: c};
      todos.push(todo);
    }
    s = this.options.b1q5t1name4;
    if (s == null) {
    } else {
      c = 'blok1q5todo4';
      todo = {name: s, code: c};
      todos.push(todo);
    }
    s = this.options.b1q5t1name5;
    if (s == null) {
    } else {
      c = 'blok1q5todo5';
      todo = {name: s, code: c};
      todos.push(todo);
    }
    question = {title: t, todos: todos};
    questions.push(question);
    //end of
  }

    // start of question
    question = [];
    todo = [];
    todos = [];
    if (this.options.b1q6title == null){} else {
      t = this.options.b1q6title;
      s = this.options.b1q6t1name1;
      if (s == null) {
      } else {
        c = 'blok1q6todo1';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b1q6t1name2;
      if (s == null) {
      } else {
        c = 'blok1q6todo2';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b1q6t1name3;
      if (s == null) {
      } else {
        c = 'blok1q6todo3';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b1q6t1name4;
      if (s == null) {
      } else {
        c = 'blok1q6todo4';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b1q6t1name5;
      if (s == null) {
      } else {
        c = 'blok1q6todo5';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      question = {title: t, todos: todos};
      questions.push(question);
      //end of question
    }
    for (let i = 0; i < questions.length; ++i) {
      let q = questions[i];
      this.blok1aantalTodosTotaal = this.blok1aantalTodosTotaal + q.todos.length;
    } // for blok 1

    return questions;
  }

  getBlok2Questions(): any {
    //build array
    let questions: any = []
    let question: any;
    let todos: any = [];
    let todo: any;
    let s: any;
    let c: any;
    let t: any;

    // start of question
    if (this.options.b2q1title == null) {
    } else {
      t = this.options.b2q1title;
      s = this.options.b2q1t1name1;
      if (s == null) {
      } else {
        c = 'blok2q1todo1';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b2q1t1name2;
      if (s == null) {
      } else {
        c = 'blok2q1todo2';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b2q1t1name3;
      if (s == null) {
      } else {
        c = 'blok2q1todo3';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b2q1t1name4;
      if (s == null) {
      } else {
        c = 'blok2q1todo4';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b2q1t1name5;
      if (s == null) {
      } else {
        c = 'blok2q1todo5';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      question = {title: t, todos: todos};
      questions.push(question);
      //end of question
    }
    // start of question
    question = [];
    todo = [];
    todos = [];
    if (this.options.b2q2title == null) {
    } else {
      t = this.options.b2q2title;
      s = this.options.b2q2t1name1;
      if (s == null) {
      } else {
        c = 'blok2q2todo1';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b2q2t1name2;
      if (s == null) {
      } else {
        c = 'blok2q2todo2';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b2q2t1name3;
      if (s == null) {
      } else {
        c = 'blok2q2todo3';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b2q2t1name4;
      if (s == null) {
      } else {
        c = 'blok2q2todo4';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b2q2t1name5;
      if (s == null) {
      } else {
        c = 'blok2q2todo5';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      question = {title: t, todos: todos};
      questions.push(question);
      //end of question
    }
    // start of question
    question = [];
    todo = [];
    todos = [];
    if (this.options.b2q3title == null) {
    } else {
      t = this.options.b2q3title;
      s = this.options.b2q3t1name1;
      if (s == null) {
      } else {
        c = 'blok2q3todo1';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b2q3t1name2;
      if (s == null) {
      } else {
        c = 'blok2q3todo2';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b2q3t1name3;
      if (s == null) {
      } else {
        c = 'blok2q3todo3';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b2q3t1name4;
      if (s == null) {
      } else {
        c = 'blok2q3todo4';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b2q3t1name5;
      if (s == null) {
      } else {
        c = 'blok2q3todo5';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      question = {title: t, todos: todos};
      questions.push(question);
      //end of question
    }
    // start of question
    question = [];
    todo = [];
    todos = [];
    if (this.options.b2q4title == null) {
    } else {

      t = this.options.b2q4title;
      s = this.options.b2q4t1name1;
      if (s == null) {
      } else {
        c = 'blok2q4todo1';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b2q4t1name2;
      if (s == null) {
      } else {
        c = 'blok2q4todo2';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b2q4t1name3;
      if (s == null) {
      } else {
        c = 'blok2q4todo3';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b2q4t1name4;
      if (s == null) {
      } else {
        c = 'blok2q4todo4';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b2q4t1name5;
      if (s == null) {
      } else {
        c = 'blok2q4todo5';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      question = {title: t, todos: todos};
      questions.push(question);
      //end of question
    }


    // start of question
    question = [];
    todo = [];
    todos = [];
    if (this.options.b2q5title == null) {
    } else {

      t = this.options.b2q5title;
      s = this.options.b2q5t1name1;
      if (s == null) {
      } else {
        c = 'blok2q5todo1';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b2q5t1name2;
      if (s == null) {
      } else {
        c = 'blok2q5todo2';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b2q5t1name3;
      if (s == null) {
      } else {
        c = 'blok2q5todo3';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b2q5t1name4;
      if (s == null) {
      } else {
        c = 'blok2q5todo4';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b2q5t1name5;
      if (s == null) {
      } else {
        c = 'blok2q5todo5';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      question = {title: t, todos: todos};
      questions.push(question);
      //end of
    }

    // start of question
    question = [];
    todo = [];
    todos = [];
    if (this.options.b2q6title == null){} else {
      t = this.options.b2q6title;
      s = this.options.b2q6t1name1;
      if (s == null) {
      } else {
        c = 'blok2q6todo1';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b2q6t1name2;
      if (s == null) {
      } else {
        c = 'blok2q6todo2';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b2q6t1name3;
      if (s == null) {
      } else {
        c = 'blok2q6todo3';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b2q6t1name4;
      if (s == null) {
      } else {
        c = 'blok2q6todo4';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b2q6t1name5;
      if (s == null) {
      } else {
        c = 'blok2q6todo5';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      question = {title: t, todos: todos};
      questions.push(question);
      //end of question
    }
    for (let i = 0; i < questions.length; ++i) {
      let q = questions[i];
      this.blok2aantalTodosTotaal = this.blok2aantalTodosTotaal + q.todos.length;
    } // for blok 2
    return questions;
  }















  getBlok3Questions(): any {
    //build array
    let questions: any = []
    let question: any;
    let todos: any = [];
    let todo: any;
    let s: any;
    let c: any;
    let t: any;

    // start of question
    if (this.options.b3q1title == null) {
    } else {
      t = this.options.b3q1title;
      s = this.options.b3q1t1name1;
      if (s == null) {
      } else {
        c = 'blok3q1todo1';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b3q1t1name2;
      if (s == null) {
      } else {
        c = 'blok3q1todo2';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b3q1t1name3;
      if (s == null) {
      } else {
        c = 'blok3q1todo3';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b3q1t1name4;
      if (s == null) {
      } else {
        c = 'blok3q1todo4';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b3q1t1name5;
      if (s == null) {
      } else {
        c = 'blok3q1todo5';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      question = {title: t, todos: todos};
      questions.push(question);
      //end of question
    }
    // start of question
    question = [];
    todo = [];
    todos = [];
    if (this.options.b3q2title == null) {
    } else {
      t = this.options.b3q2title;
      s = this.options.b3q2t1name1;
      if (s == null) {
      } else {
        c = 'blok3q2todo1';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b3q2t1name2;
      if (s == null) {
      } else {
        c = 'blok3q2todo2';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b3q2t1name3;
      if (s == null) {
      } else {
        c = 'blok3q2todo3';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b3q2t1name4;
      if (s == null) {
      } else {
        c = 'blok3q2todo4';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b3q2t1name5;
      if (s == null) {
      } else {
        c = 'blok3q2todo5';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      question = {title: t, todos: todos};
      questions.push(question);
      //end of question
    }
    // start of question
    question = [];
    todo = [];
    todos = [];
    if (this.options.b3q3title == null) {
    } else {
      t = this.options.b3q3title;
      s = this.options.b3q3t1name1;
      if (s == null) {
      } else {
        c = 'blok3q3todo1';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b3q3t1name2;
      if (s == null) {
      } else {
        c = 'blok3q3todo2';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b3q3t1name3;
      if (s == null) {
      } else {
        c = 'blok3q3todo3';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b3q3t1name4;
      if (s == null) {
      } else {
        c = 'blok3q3todo4';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b3q3t1name5;
      if (s == null) {
      } else {
        c = 'blok3q3todo5';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      question = {title: t, todos: todos};
      questions.push(question);
      //end of question
    }
    // start of question
    question = [];
    todo = [];
    todos = [];
    if (this.options.b3q4title == null) {
    } else {

      t = this.options.b3q4title;
      s = this.options.b3q4t1name1;
      if (s == null) {
      } else {
        c = 'blok3q4todo1';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b3q4t1name2;
      if (s == null) {
      } else {
        c = 'blok3q4todo2';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b3q4t1name3;
      if (s == null) {
      } else {
        c = 'blok3q4todo3';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b3q4t1name4;
      if (s == null) {
      } else {
        c = 'blok3q4todo4';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b3q4t1name5;
      if (s == null) {
      } else {
        c = 'blok3q4todo5';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      question = {title: t, todos: todos};
      questions.push(question);
      //end of question
    }


    // start of question
    question = [];
    todo = [];
    todos = [];
    if (this.options.b3q5title == null) {
    } else {

      t = this.options.b3q5title;
      s = this.options.b3q5t1name1;
      if (s == null) {
      } else {
        c = 'blok3q5todo1';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b3q5t1name2;
      if (s == null) {
      } else {
        c = 'blok3q5todo2';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b3q5t1name3;
      if (s == null) {
      } else {
        c = 'blok3q5todo3';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b2q5t1name4;
      if (s == null) {
      } else {
        c = 'blok3q5todo4';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b3q5t1name5;
      if (s == null) {
      } else {
        c = 'blok3q5todo5';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      question = {title: t, todos: todos};
      questions.push(question);
      //end of
    }

    // start of question
    question = [];
    todo = [];
    todos = [];
    if (this.options.b3q6title == null) {
    } else {
      t = this.options.b3q6title;
      s = this.options.b3q6t1name1;
      if (s == null) {
      } else {
        c = 'blok3q6todo1';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b3q6t1name2;
      if (s == null) {
      } else {
        c = 'blok3q6todo2';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b3q6t1name3;
      if (s == null) {
      } else {
        c = 'blok3q6todo3';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b3q6t1name4;
      if (s == null) {
      } else {
        c = 'blok3q6todo4';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      s = this.options.b3q6t1name5;
      if (s == null) {
      } else {
        c = 'blok3q6todo5';
        todo = {name: s, code: c};
        todos.push(todo);
      }
      question = {title: t, todos: todos};
      questions.push(question);
      //end of question
    }
    for (let i = 0; i < questions.length; ++i) {
      let q = questions[i];
      this.blok3aantalTodosTotaal = this.blok3aantalTodosTotaal + q.todos.length;
    } // for blok 3
    return questions;
  }


    getBlok4Questions(): any {
      //build array
      let questions: any = []
      let question: any;
      let todos: any = [];
      let todo: any;
      let s: any;
      let c: any;
      let t: any;

      // start of question
      if (this.options.b4q1title == null) {
      } else {
        t = this.options.b4q1title;
        s = this.options.b4q1t1name1;
        if (s == null) {
        } else {
          c = 'blok4q1todo1';
          todo = {name: s, code: c};
          todos.push(todo);
        }
        s = this.options.b4q1t1name2;
        if (s == null) {
        } else {
          c = 'blok4q1todo2';
          todo = {name: s, code: c};
          todos.push(todo);
        }
        s = this.options.b4q1t1name3;
        if (s == null) {
        } else {
          c = 'blok4q1todo3';
          todo = {name: s, code: c};
          todos.push(todo);
        }
        s = this.options.b4q1t1name4;
        if (s == null) {
        } else {
          c = 'blok4q1todo4';
          todo = {name: s, code: c};
          todos.push(todo);
        }
        s = this.options.b4q1t1name5;
        if (s == null) {
        } else {
          c = 'blok4q1todo5';
          todo = {name: s, code: c};
          todos.push(todo);
        }
        question = {title: t, todos: todos};
        questions.push(question);
        //end of question
      }
      // start of question
      question = [];
      todo = [];
      todos = [];
      if (this.options.b4q2title == null) {
      } else {
        t = this.options.b4q2title;
        s = this.options.b4q2t1name1;
        if (s == null) {
        } else {
          c = 'blok4q2todo1';
          todo = {name: s, code: c};
          todos.push(todo);
        }
        s = this.options.b4q2t1name2;
        if (s == null) {
        } else {
          c = 'blok4q2todo2';
          todo = {name: s, code: c};
          todos.push(todo);
        }
        s = this.options.b4q2t1name3;
        if (s == null) {
        } else {
          c = 'blok4q2todo3';
          todo = {name: s, code: c};
          todos.push(todo);
        }
        s = this.options.b4q2t1name4;
        if (s == null) {
        } else {
          c = 'blok4q2todo4';
          todo = {name: s, code: c};
          todos.push(todo);
        }
        s = this.options.b4q2t1name5;
        if (s == null) {
        } else {
          c = 'blok4q2todo5';
          todo = {name: s, code: c};
          todos.push(todo);
        }
        question = {title: t, todos: todos};
        questions.push(question);
        //end of question
      }
      // start of question
      question = [];
      todo = [];
      todos = [];
      if (this.options.b4q3title == null) {
      } else {
        t = this.options.b4q3title;
        s = this.options.b4q3t1name1;
        if (s == null) {
        } else {
          c = 'blok4q3todo1';
          todo = {name: s, code: c};
          todos.push(todo);
        }
        s = this.options.b4q3t1name2;
        if (s == null) {
        } else {
          c = 'blok4q3todo2';
          todo = {name: s, code: c};
          todos.push(todo);
        }
        s = this.options.b4q3t1name3;
        if (s == null) {
        } else {
          c = 'blok4q3todo3';
          todo = {name: s, code: c};
          todos.push(todo);
        }
        s = this.options.b4q3t1name4;
        if (s == null) {
        } else {
          c = 'blok4q3todo4';
          todo = {name: s, code: c};
          todos.push(todo);
        }
        s = this.options.b4q3t1name5;
        if (s == null) {
        } else {
          c = 'blok4q3todo5';
          todo = {name: s, code: c};
          todos.push(todo);
        }
        question = {title: t, todos: todos};
        questions.push(question);
        //end of question
      }
      // start of question
      question = [];
      todo = [];
      todos = [];
      if (this.options.b4q4title == null) {
      } else {

        t = this.options.b4q4title;
        s = this.options.b4q4t1name1;
        if (s == null) {
        } else {
          c = 'blok4q4todo1';
          todo = {name: s, code: c};
          todos.push(todo);
        }
        s = this.options.b4q4t1name2;
        if (s == null) {
        } else {
          c = 'blok4q4todo2';
          todo = {name: s, code: c};
          todos.push(todo);
        }
        s = this.options.b4q4t1name3;
        if (s == null) {
        } else {
          c = 'blok4q4todo3';
          todo = {name: s, code: c};
          todos.push(todo);
        }
        s = this.options.b4q4t1name4;
        if (s == null) {
        } else {
          c = 'blok4q4todo4';
          todo = {name: s, code: c};
          todos.push(todo);
        }
        s = this.options.b4q4t1name5;
        if (s == null) {
        } else {
          c = 'blok4q4todo5';
          todo = {name: s, code: c};
          todos.push(todo);
        }
        question = {title: t, todos: todos};
        questions.push(question);
        //end of question
      }


      // start of question
      question = [];
      todo = [];
      todos = [];
      if (this.options.b4q5title == null) {
      } else {

        t = this.options.b4q5title;
        s = this.options.b4q5t1name1;
        if (s == null) {
        } else {
          c = 'blok4q5todo1';
          todo = {name: s, code: c};
          todos.push(todo);
        }
        s = this.options.b4q5t1name2;
        if (s == null) {
        } else {
          c = 'blok4q5todo2';
          todo = {name: s, code: c};
          todos.push(todo);
        }
        s = this.options.b4q5t1name3;
        if (s == null) {
        } else {
          c = 'blok4q5todo3';
          todo = {name: s, code: c};
          todos.push(todo);
        }
        s = this.options.b4q5t1name4;
        if (s == null) {
        } else {
          c = 'blok4q5todo4';
          todo = {name: s, code: c};
          todos.push(todo);
        }
        s = this.options.b4q5t1name5;
        if (s == null) {
        } else {
          c = 'blok4q5todo5';
          todo = {name: s, code: c};
          todos.push(todo);
        }
        question = {title: t, todos: todos};
        questions.push(question);
        //end of
      }

      // start of question
      question = [];
      todo = [];
      todos = [];
      if (this.options.b4q6title == null){} else {
        t = this.options.b4q6title;
        s = this.options.b4q6t1name1;
        if (s == null) {
        } else {
          c = 'blok4q6todo1';
          todo = {name: s, code: c};
          todos.push(todo);
        }
        s = this.options.b4q6t1name2;
        if (s == null) {
        } else {
          c = 'blok4q6todo2';
          todo = {name: s, code: c};
          todos.push(todo);
        }
        s = this.options.b4q6t1name3;
        if (s == null) {
        } else {
          c = 'blok4q6todo3';
          todo = {name: s, code: c};
          todos.push(todo);
        }
        s = this.options.b4q6t1name4;
        if (s == null) {
        } else {
          c = 'blok4q6todo4';
          todo = {name: s, code: c};
          todos.push(todo);
        }
        s = this.options.b4q6t1name5;
        if (s == null) {
        } else {
          c = 'blok4q6todo5';
          todo = {name: s, code: c};
          todos.push(todo);
        }
        question = {title: t, todos: todos};
        questions.push(question);
        //end of question
      }
      for (let i = 0; i < questions.length; ++i) {
        let q = questions[i];
        this.blok4aantalTodosTotaal = this.blok4aantalTodosTotaal + q.todos.length;
      } // for blok 2
      return questions;
    }


}
