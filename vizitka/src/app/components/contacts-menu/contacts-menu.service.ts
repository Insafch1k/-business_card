import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactsMenuService {
  private isMenuOpen = new BehaviorSubject<boolean>(false);
  isMenuOpen$ = this.isMenuOpen.asObservable();

  openMenu() {
    this.isMenuOpen.next(true);
    document.body.style.overflow = 'hidden';
  }

  closeMenu() {
    this.isMenuOpen.next(false);
    document.body.style.overflow = '';
  }
}
