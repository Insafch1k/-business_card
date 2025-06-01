import {
  Component,
  HostListener,
  AfterViewInit,
  ElementRef,
  NgZone,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ContactsMenuService } from '../contacts-menu/contacts-menu.service';
import { CommonModule } from '@angular/common';
import { BurgerMenuComponent } from '../../burger-menu/burger-menu.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, BurgerMenuComponent],
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  isBurgerOpen = false;
  private resizeObserver: ResizeObserver | null = null;

  constructor(
    private menuService: ContactsMenuService,
    private el: ElementRef,
    private ngZone: NgZone,
    private router: Router
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
      history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search
      );
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.updateBackgroundHeight();
  }

  private updateBackgroundHeight() {
    const headerEl = this.headerElementRef?.nativeElement;
    const mainComponent = document.querySelector('app-main .main');

    if (headerEl && mainComponent) {
      const headerHeight = headerEl.offsetHeight;
      const mainHeight = mainComponent.scrollHeight;
      const totalHeight = headerHeight + mainHeight;

      document.documentElement.style.setProperty(
        '--background-height',
        `${totalHeight}px`
      );
      console.log(`Updated --background-height: ${totalHeight}px`);
    } else {
      console.warn('Header or Main component not found for height calculation');
    }
  }

  private setupResizeObserver() {
    const mainComponent = document.querySelector('app-main .main');
    if (mainComponent && window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(() => {
        this.ngZone.run(() => this.updateBackgroundHeight());
      });
      this.resizeObserver.observe(mainComponent);
    }
  }

  openContactsMenu() {
    console.log('Opening Contacts Menu');
    this.menuService.openMenu();
  }

  toggleBurgerMenu() {
    this.isBurgerOpen = !this.isBurgerOpen;
    console.log('Burger menu toggled, isBurgerOpen:', this.isBurgerOpen);
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
      console.log('Closed burger menu due to outside click');
    }
  }
}
