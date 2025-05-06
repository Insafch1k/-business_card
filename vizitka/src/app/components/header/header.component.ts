import {
  Component,
  HostListener,
  AfterViewInit,
  ElementRef,
  NgZone,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { ContactsMenuService } from '../contacts-menu/contacts-menu.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  isBurgerOpen = false;
  private resizeObserver: ResizeObserver | null = null;

  constructor(
    private menuService: ContactsMenuService,
    private el: ElementRef,
    private ngZone: NgZone
  ) {}

  @ViewChild('logoEl') logoElementRef!: ElementRef;
  @ViewChild('headerEl') headerElementRef!: ElementRef;

  ngAfterViewInit() {
    setTimeout(() => {
      this.updateBackgroundHeight();
      this.setupResizeObserver();
    });
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
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
      !target.closest('.burger-menu-dropdown') &&
      !target.closest('app-burger-menu')
    ) {
      this.isBurgerOpen = false;
    }
  }
}
