import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  OnDestroy,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import HomeComponent from '../home/home.component';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ServicesComponent implements OnInit, OnDestroy {
  private homeComponent = inject(HomeComponent);

  @ViewChild('servicesTrack') servicesTrack!: ElementRef;

  scrollToContacts(event: Event): void {
    event.preventDefault();
    this.homeComponent.scrollTo('contacts');
  }

  originalServices = [
    {
      id: 1,
      title: 'Создание сайта',
      image: 'assets/services/site.png',
      anchor: 'contacts',
    },
    {
      id: 2,
      title: 'Разработка Telegram-бота',
      image: 'assets/services/bot.png',
      anchor: 'contacts',
    },
    {
      id: 3,
      title: 'Разработка мобильного приложения',
      image: 'assets/services/mob.png',
      anchor: 'contacts',
    },
    {
      id: 4,
      title: 'Разработка Web-приложения',
      image: 'assets/services/web.png',
      anchor: 'contacts',
    },
    {
      id: 5,
      title: 'CRM-системы',
      image: 'assets/services/crm.png',
      anchor: 'contacts',
    },
  ];

  services = [...this.originalServices];
  currentPosition = 0;
  animationFrameId: number | null = null;
  isPaused = false;
  cardWidth = 392;
  gap = 20;
  speed = 1;
  selectedIndex: number | null = null;
  pauseDuration = 3000;
  resumeTimeout: any;
  singleCycleWidth: number = 0;
  currentCenterIndex: number = 0;
  shouldResumeAnimation = true;
  pendingOperations = 0;

  ngOnInit(): void {
    this.prepareCarousel();
    this.startAnimation();
  }

  prepareCarousel(): void {
    this.services = [
      ...this.originalServices,
      ...this.originalServices,
      ...this.originalServices,
    ];
    this.singleCycleWidth =
      (this.cardWidth + this.gap) * this.originalServices.length;
  }

  ngOnDestroy(): void {
    this.stopAnimation();
    clearTimeout(this.resumeTimeout);
  }

  startAnimation(): void {
    if (this.animationFrameId !== null) return;

    const animate = () => {
      if (!this.isPaused) {
        this.currentPosition -= this.speed;

        if (Math.abs(this.currentPosition) >= this.singleCycleWidth) {
          this.currentPosition += this.singleCycleWidth;
          this.updateTrackPosition(true);
        }

        this.updateTrackPosition();
      }
      this.animationFrameId = requestAnimationFrame(animate);
    };
    this.animationFrameId = requestAnimationFrame(animate);
  }

  stopAnimation(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  updateTrackPosition(instant = false): void {
    const track = this.servicesTrack.nativeElement;
    track.style.transform = `translateX(${this.currentPosition}px)`;

    if (instant) {
      track.style.transition = 'none';
      void track.offsetWidth;
    } else {
      track.style.transition = `transform ${this.speed * 0.16}s linear`;
    }
  }

  centerCard(index: number): void {
    this.pendingOperations++;
    if (!this.isPaused && this.animationFrameId !== null) {
      this.shouldResumeAnimation = true;
    }

    this.isPaused = true;
    this.stopAnimation();
    this.selectedIndex = index;
    this.currentCenterIndex = index % this.originalServices.length;

    const container = this.servicesTrack.nativeElement.parentElement;
    const containerWidth = container.offsetWidth;
    const containerCenter = containerWidth / 2;

    const card = this.servicesTrack.nativeElement.children[index];
    const cardRect = card.getBoundingClientRect();
    const cardCenter =
      cardRect.left -
      container.getBoundingClientRect().left +
      cardRect.width / 2;

    const offset = cardCenter - containerCenter;
    this.currentPosition -= offset;

    this.updateTrackPosition(true);

    card.classList.add('zoomed-card');

    Array.from(this.servicesTrack.nativeElement.children).forEach(
      (child: unknown, i: number) => {
        if (i !== index && child instanceof HTMLElement) {
          child.classList.remove('zoomed-card');
        }
      }
    );

    const currentOperation = this.pendingOperations;

    clearTimeout(this.resumeTimeout);
    this.resumeTimeout = setTimeout(() => {
      if (currentOperation === this.pendingOperations) {
        this.isPaused = false;
        this.selectedIndex = null;
        card.classList.remove('zoomed-card');
        if (this.shouldResumeAnimation) {
          this.startAnimation();
        }
      }
    }, this.pauseDuration);
  }

  onCardClick(index: number): void {
    this.centerCard(index);
  }

  scroll(direction: 'left' | 'right'): void {
    this.pendingOperations++;
    if (!this.isPaused && this.animationFrameId !== null) {
      this.shouldResumeAnimation = true;
    }

    this.isPaused = true;
    this.stopAnimation();

    let newIndex: number;
    if (direction === 'left') {
      newIndex = this.findCurrentCenterIndex() - 1;
    } else {
      newIndex = this.findCurrentCenterIndex() + 1;
    }

    if (newIndex >= this.services.length) newIndex = 0;
    if (newIndex < 0) newIndex = this.services.length - 1;

    const card = this.servicesTrack.nativeElement.children[newIndex];

    const container = this.servicesTrack.nativeElement.parentElement;
    const containerWidth = container.offsetWidth;
    const containerCenter = containerWidth / 2;

    const cardRect = card.getBoundingClientRect();
    const cardCenter =
      cardRect.left -
      container.getBoundingClientRect().left +
      cardRect.width / 2;

    const offset = cardCenter - containerCenter;
    this.currentPosition -= offset;

    this.updateTrackPosition(true);

    card.classList.add('zoomed-card');

    Array.from(this.servicesTrack.nativeElement.children).forEach(
      (child: unknown, i: number) => {
        if (i !== newIndex && child instanceof HTMLElement) {
          child.classList.remove('zoomed-card');
        }
      }
    );

    this.selectedIndex = newIndex;

    const currentOperation = this.pendingOperations;

    clearTimeout(this.resumeTimeout);
    this.resumeTimeout = setTimeout(() => {
      if (currentOperation === this.pendingOperations) {
        this.isPaused = false;
        this.selectedIndex = null;
        card.classList.remove('zoomed-card');
        if (this.shouldResumeAnimation) {
          this.startAnimation();
        }
      }
    }, this.pauseDuration);
  }

  findCurrentCenterIndex(): number {
    const container = this.servicesTrack.nativeElement.parentElement;
    const containerWidth = container.offsetWidth;
    const containerCenter = containerWidth / 2;

    let closestIndex = 0;
    let smallestDistance = Infinity;

    Array.from<HTMLElement>(this.servicesTrack.nativeElement.children).forEach(
      (child, index) => {
        const rect = child.getBoundingClientRect();
        const cardCenter =
          rect.left - container.getBoundingClientRect().left + rect.width / 2;
        const distance = Math.abs(cardCenter - containerCenter);

        if (distance < smallestDistance) {
          smallestDistance = distance;
          closestIndex = index;
        }
      }
    );

    return closestIndex;
  }

  trackByFn(index: number, item: any): number {
    return item.id;
  }
}
