import { Injectable } from "@angular/core";

@Injectable()
export class WiaUrlStateManager {

  public getUrlCode(): string {
    const code = window.location.hash.substr(1);

    if (code.length === 5 || code.length === 6) {
      return code;
    }
  }

  public setUrlCode(code: string): void {
    window.location.hash = code;
  }
}
