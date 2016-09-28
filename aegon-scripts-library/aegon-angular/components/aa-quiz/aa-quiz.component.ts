import {Component, Input, Output, NgZone, ElementRef, ViewChild} from '@angular/core';
import {template} from "./template";
import {AABaseComponent} from '../../lib/classes/AABaseComponent';
import {defaultOptions} from "./defaultOptions";
import * as libDom from "../../lib/dom";
import * as libUtil from "../../lib/util";

declare var jQuery: any;

@Component({
  selector: 'aa-quiz',
  template: template
})

export class AAQuizComponent extends AABaseComponent {
  @Input() options: any = {};
  @Input() data: any = {};
  public defaultOptions : any = defaultOptions;
  public questions: any;
  private answerTimeout: any;

  // Let parent class initialize config; the dependency injection with ElementRef
  // doesn't work directly so we have to call it explicitly.
  constructor(elementRef: ElementRef, private zone:NgZone) {
    super(elementRef);
  }
  ngOnInit(): void {
    // Always call the super first
    super.ngOnInit();
    // Initial state
    this.reset();
  }
  // Reset quiz and start over; UI will automatically update
  reset() : void {
    // Initial state
    this.data.state = 'start'; // State for ui
    this.data.question = 0; // Current question
    this.data.answers = []; // Answers as true, false in array
    this.data.lastQuestion = 0; // Last question not answered yet
    this.data.done = false; // Finished test; show results
    this.data.tips = []; // Tip objects
    this.data.tip = 0; // Current tip
    this.data.score = 0; // Final score
    this.data.justClicked = undefined; // Answer just clicked; used for animation
  }
  // Give an answer to a question
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
  // Directly goto a question
  gotoQuestion(nr : number) : void {
    this.data.question = Math.min(nr, this.data.lastQuestion);
  }
  // Goto next question
  nextQuestion() : void {
    this.data.question = this.data.question + 1;
    // Goto last question if clicked a future question
    this.data.lastQuestion = Math.max(this.data.lastQuestion, this.data.question);
    // No more questions? goto results
    if (this.data.question >= this.data.options.questions.length) {
      this.gotoResults();
    }
  }
  // Show me the results!
  gotoResults() : void {
    this.data.state = 'results';
    this.data.done = true;
    this.data.tips = [];
    this.data.score = 0;
    // Calculate score and generate tips
    this.data.options.questions.map((question, idx) => {
      if (question.correct !== this.data.answers[idx]) {
        // Wrong answer; add tip
        if (question.tip) {
          this.data.tips.push(question);
        }
      } else {
        // Good answer: +1
        this.data.score++;
      }
    });
  }
  // Goto next tip; and make it rollover to first
  nextTip(delta : number = 1) : void {
    this.data.tip = (this.data.tip + delta + this.data.tips.length) % this.data.tips.length;
  }
}
