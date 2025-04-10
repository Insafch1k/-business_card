import { Component } from '@angular/core';
import { ContactsMenuService } from '../contacts-menu/contacts-menu.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  constructor(private menuService: ContactsMenuService) {}

  openContactsMenu() {
    this.menuService.openMenu();
  }
}
