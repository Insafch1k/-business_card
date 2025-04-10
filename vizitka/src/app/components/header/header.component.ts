import { Component } from '@angular/core';
import { ContactsMenuService } from '../contacts-menu/contacts-menu.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(private menuService: ContactsMenuService) {}

  openContactsMenu() {
    this.menuService.openMenu();
  }
}
