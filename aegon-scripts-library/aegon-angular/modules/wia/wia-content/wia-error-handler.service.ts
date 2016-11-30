import { ErrorHandler, OnInit } from "@angular/core";
import { BehaviorSubject, Subject, Observable } from "rxjs";

/**
 * WIAErrorHandlerService created on 11/28/16 1:09 PM.
 *
 * @description Custom error handler for WIA component. Emits events when an error occurs.
 * @author Florian Popa <florian@webgenerals.com>
 */
export class WIAErrorHandlerService implements ErrorHandler {

  private static singleton: WIAErrorHandlerService;
  private errorHandlerEvent: BehaviorSubject<any>;

  /**
   * Creates a singleton to share the same events
   *
   * @returns {WIAErrorHandlerService}
   */
  constructor () {
    if (!WIAErrorHandlerService.singleton) {
      WIAErrorHandlerService.singleton = this;
      this.errorHandlerEvent = new BehaviorSubject(null);
    }

    return WIAErrorHandlerService.singleton;
  }

  /**
   * Called automatically when an error is thrown in the application
   *
   * @param {Object} error
   */
  handleError(error: any): void {
    this.emit(error);
  }

  /**
   * Subscribes to the event emitter
   *
   * @param {Function} callback
   */
  public subscribe (callback) {
    this
      .errorHandlerEvent
      .filter(el => el !== null)
      .subscribe(callback);
  }

  /**
   * Triggers a new event with the error body
   *
   * @param {Object} error
   */
  public emit (error: any) {
      this
        .errorHandlerEvent
        .next(error);
  }
}
