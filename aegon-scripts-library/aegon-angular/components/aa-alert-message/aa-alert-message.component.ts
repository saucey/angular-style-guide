import { Component, OnInit, Input } from "@angular/core";

/**
 * AAAlertMessageComponent created on 11/29/16 2:02 PM.
 *
 * @description Shows an alert information message to the user.
 * @author Florian Popa <florian@webgenerals.com>
 */

@Component({
  selector: 'aa-alert-message',
  template: require('./template.html')
})

export class AAAlertMessageComponent implements OnInit {

  @Input() isVisible: boolean = false;
  @Input() title: string = '';
  @Input() body: string = '';

  public ngOnInit(): void {
  }
}
