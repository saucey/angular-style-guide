import {Component, Input, Output, NgZone, ElementRef, ViewChild} from 'angular2/core';
import {template} from "./template";
import {AABaseComponent} from '../../lib/classes/AABaseComponent';
import {defaultOptions} from "./defaultOptions";
import * as libDom from "../../lib/dom";
import * as libUtil from "../../lib/util";

declare var jQuery: any;

@Component({
  selector: 'aa-beleggen-test',
  template: template
})

export class AABeleggenTestComponent extends AABaseComponent {
  @Input() options: any = {};
  @Input() data: any = {};
  @Input() visible: boolean = false;

  // Internal slider DOM reference
  @ViewChild('form') form: ElementRef;

  public defaultOptions : any = defaultOptions;
  public questions: any;
  private answerTimeout: any;
  // Let parent class initialize config; the dependency injection with ElementRef
  // doesn't work directly so we have to call it explicitly.
  constructor(elementRef: ElementRef, private zone:NgZone) {
    super(elementRef);
  }

  ngOnInit(): void {
    super.ngOnInit();
    // Initial state
    this.data.state = this.data.state || 'start';

    // Init initial state
    this.reset();

    // Demo mode?
    if (this.data.options.demo) {
      setInterval(() => {
        this.data.state = this.data.state === 'start' ? 'loading' : this.data.state === 'loading' ? 'thanks' : 'start';
      }, this.data.options.demo);
    }
  }
  // Reset state
  reset() : void {
    this.data.question = 0;
    this.data.answers = {};
    this.data.lastQuestion = 0;
    this.data.done = false;
    this.data.state = 'start';
    this.data.tips = [];
    this.data.tip = 0;
    this.data.score = 0;
    this.data.countQuestions = this.data.options.questions.length;
  }

  answer(question : number, answer : boolean) : void {
    if (this.answerTimeout) {
      return;
    }
    this.data.answers[question] = answer;
    this.data.justClicked = answer;
    // Add bounce on answer click
    this.answerTimeout = setTimeout(() => {
      this.refresh(() => {
        delete this.data.justClicked;
        // Advance to next question
        this.nextQuestion();
        delete this.answerTimeout;
      });
    }, 150);
  }

  nextQuestion() : void {
    this.data.question = this.data.question + 1;
    this.data.lastQuestion = Math.max(this.data.lastQuestion, this.data.question);
    if (this.data.question >= this.data.options.questions.length) {
      this.gotoResults();
    }
  }

  gotoQuestion(nr : number) : void {
    this.data.question = Math.min(nr, this.data.lastQuestion);
  }

  gotoResults() : void {
    this.data.state = 'results';
    this.data.done = true;
    this.data.tips = [];
    this.data.score = 0;
    // Check tips
    this.data.options.questions.map((question, idx) => {
      if (question.correct !== this.data.answers[idx]) {
        // Wrong answer; add tip
        this.data.tips.push(question);
      } else {
        // Good answer: +1
        this.data.score++;
      }
    });
  }

  nextTip() : void {
    this.data.tip = (this.data.tip + 1) % this.data.tips.length;
  }

  prevTip() : void {
    this.data.tip = (this.data.tip - 1 + this.data.tips.length) % this.data.tips.length;
  }

  gotoQuestions() : void {
    this.data.state = 'start';
    this.data.question = 0;
  }
}
