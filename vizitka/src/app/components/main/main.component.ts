import { Component } from '@angular/core';
import { ContactsMenuService } from '../contacts-menu/contacts-menu.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class MainComponent {
  constructor(private menuService: ContactsMenuService) {}

  openContactsMenu() {
    this.menuService.openMenu();
  }
}
