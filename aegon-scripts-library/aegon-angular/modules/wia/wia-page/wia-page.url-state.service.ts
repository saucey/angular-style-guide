import { Injectable } from "@angular/core";

@Injectable()
export class WiaUrlStateManager {

  public getUrlCode(): string {

    return window.location.hash.substr(1);
  }

  public setUrlCode(code: string): void {
    window.location.hash = code;
  }
}
