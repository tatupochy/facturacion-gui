import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  private _scrollToTop = new BehaviorSubject<void>(null);
  scrollToTop$ = this._scrollToTop.asObservable();

  triggerScrollToTop() {
    this._scrollToTop.next();
  }
}