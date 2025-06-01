import { Component, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsMenuService } from './contacts-menu.service';
import { AsyncPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-contacts-menu',
  templateUrl: './contacts-menu.component.html',
  styleUrls: ['./contacts-menu.component.scss'],
  standalone: true,
  imports: [CommonModule, AsyncPipe, RouterModule],
})
export class ContactsMenuComponent implements AfterViewInit {
  constructor(
    public menuService: ContactsMenuService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.menuService.isMenuOpen$.subscribe((isOpen) => {
      console.log('ContactsMenuComponent: isMenuOpen$ =', isOpen);
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit() {
    console.log('ContactsMenuComponent: ngAfterViewInit');
  }

  closeMenu() {
    console.log('ContactsMenuComponent: closeMenu called');
    this.menuService.closeMenu();
  }

  goToContacts() {
    console.log('ContactsMenuComponent: goToContacts called');
    this.closeMenu();

    this.router
      .navigate([''], { fragment: 'contacts' })
      .then((success) => {
        console.log('ContactsMenuComponent: Navigation success =', success);
        setTimeout(() => {
          const element = document.getElementById('contacts');
          if (element) {
            console.log(
              'ContactsMenuComponent: Found contacts element, scrolling'
            );
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.replaceState(
              null,
              '',
              window.location.pathname + window.location.search
            );
          } else {
            console.error('ContactsMenuComponent: Element #contacts not found');
          }
        }, 100);
      })
      .catch((error) => {
        console.error('ContactsMenuComponent: Navigation error =', error);
      });
  }
}
