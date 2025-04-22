import {
  Component,
  HostListener,
  AfterViewInit,
  ElementRef,
  NgZone,
} from '@angular/core';
import { ContactsMenuService } from '../contacts-menu/contacts-menu.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate(
          '200ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '150ms ease-in',
          style({ opacity: 0, transform: 'translateY(-10px)' })
        ),
      ]),
    ]),
  ],
})
export class HeaderComponent implements AfterViewInit {
  isBurgerOpen = false;
  private resizeObserver: ResizeObserver | null = null;

  constructor(
    private menuService: ContactsMenuService,
    private el: ElementRef,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit() {
    // Отложим на следующую макротаску, чтобы main успел отрисоваться
    setTimeout(() => {
      this.updateBackgroundHeight();
      this.setupResizeObserver();
    });
  }

  scrollTo(id: string): void {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.updateBackgroundHeight();
  }

  private updateBackgroundHeight() {
    const headerEl = this.el.nativeElement;
    const appMain = headerEl.nextElementSibling;

    if (appMain && appMain.tagName.toLowerCase() === 'app-main') {
      const mainComponent = appMain as HTMLElement;
      const realMainEl = mainComponent.querySelector('.main');

      if (realMainEl) {
        const headerHeight = headerEl.offsetHeight;
        const mainHeight = realMainEl.scrollHeight;

        document.documentElement.style.setProperty(
          '--background-height',
          `${headerHeight + mainHeight}px`
        );
      }
    }
  }

  private setupResizeObserver() {
    const headerEl = this.el.nativeElement;
    const appMain = headerEl.nextElementSibling;

    if (appMain && appMain.tagName.toLowerCase() === 'app-main') {
      const realMainEl = appMain.querySelector('.main');

      if (realMainEl && window.ResizeObserver) {
        this.resizeObserver = new ResizeObserver(() => {
          this.ngZone.run(() => this.updateBackgroundHeight());
        });
        this.resizeObserver.observe(realMainEl);
      }
    }
  }

  openContactsMenu() {
    this.menuService.openMenu();
  }

  toggleBurgerMenu() {
    this.isBurgerOpen = !this.isBurgerOpen;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (
      this.isBurgerOpen &&
      !target.closest('.mobile-burger-menu') &&
      !target.closest('.burger-menu-dropdown')
    ) {
      this.isBurgerOpen = false;
    }
  }
}
