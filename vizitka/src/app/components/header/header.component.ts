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
    const mainComponent = document.querySelector(
      'app-main .main'
    ) as HTMLElement | null;
    if (mainComponent) {
      const mainTop = mainComponent.offsetTop;
      const mainHeight = mainComponent.offsetHeight; 
      const totalHeight = mainTop + mainHeight - 3;

      document.documentElement.style.setProperty(
        '--background-height',
        `${totalHeight}px`
      );
      console.log(
        `Updated --background-height: ${totalHeight}px (mainTop: ${mainTop}px, mainHeight: ${mainHeight}px)`
      );
    } else {
      console.warn('Main component not found for height calculation');
    }
  }

  private setupResizeObserver() {
    const mainComponent = document.querySelector(
      'app-main .main'
    ) as HTMLElement | null;
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

    if (this.isBurgerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    console.log('Burger menu toggled, isBurgerOpen:', this.isBurgerOpen);
  }

  closeBurgerMenu() {
    this.isBurgerOpen = false;
    document.body.style.overflow = 'auto';
    console.log('Burger menu closed');
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
      this.closeBurgerMenu();
    }
  }
}
