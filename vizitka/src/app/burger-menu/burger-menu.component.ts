import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-burger-menu',
  templateUrl: './burger-menu.component.html',
  styleUrls: ['./burger-menu.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class BurgerMenuComponent {
  @Output() closeBurgerMenu = new EventEmitter<void>();

  scrollToAndClose(id: string): void {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search
      );
    }

    this.closeBurgerMenu.emit();
  }

  closeBurgerMenuHandler(): void {
    this.closeBurgerMenu.emit();
  }
}
