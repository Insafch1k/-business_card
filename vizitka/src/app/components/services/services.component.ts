import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  OnDestroy,
  AfterViewInit,
  HostListener,
  ChangeDetectorRef,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import HomeComponent from '../home/home.component';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesComponent implements OnInit, AfterViewInit, OnDestroy {
  private homeComponent = inject(HomeComponent);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('servicesTrack') servicesTrack!: ElementRef;

  scrollToContacts(event: Event): void {
    event.preventDefault();
    this.homeComponent.scrollTo('contacts');
  }

  services = [
    {
      id: 1,
      title: 'Создание Сайтов под Ключ',
      image: 'assets/services/site.webp',
      anchor: 'contacts',
      alt: 'разработка сайтов казань, дизайн лендинга казань, услуги веб-дизайна казань, заказать сайт казань,заказать сайт казань,заказать лендинг под ключ казань,веб-студия Казань,корпоративный сайт заказать',
    },
    {
      id: 2,
      title: 'Разработка Telegram mini Apps и Telegram ботов',
      image: 'assets/services/bot.webp',
      anchor: 'contacts',
      alt: 'разработка бота в telegram казань, дизайн лендинга казань, услуги веб-дизайна казань,',
    },
    {
      id: 3,
      title: 'Разработка кроссплатформенных мобильных приложений',
      image: 'assets/services/mob.webp',
      anchor: 'contacts',
      alt: 'Разработка мобильных приложений казань, дизайн лендинга казань, услуги веб-дизайна казань, заказать мобильное приложение казань',
    },
    {
      id: 4,
      title: 'Разработка Web-приложения',
      image: 'assets/services/web.webp',
      anchor: 'contacts',
      alt: 'дизайн лендинга казань, услуги веб-дизайна казань,',
    },
    {
      id: 5,
      title: 'Разработка и внедрение CRM систем',
      image: 'assets/services/crm.webp',
      anchor: 'contacts',
      alt: 'разработка CRM для бизнеса, дизайн лендинга казань, услуги веб-дизайна нам,',
    },
  ];

  currentPosition = 0;
  animationFrameId: number | null = null;
  isPaused = false;
  cardWidth: number = 0;
  gap = 20;
  speed = 2;
  selectedIndex: number | null = null;
  pauseDuration = 2000;
  resumeTimeout: any;
  direction: 'left' | 'right' = 'left';
  isFirstCard = true;
  isLastCard = false;
  marginOffset = 70;
  isAutoScroll = true;
  private isSwiping = false;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.updateCardWidth();
    this.speed = window.innerWidth <= 768 ? 1 : 2;
    this.adjustPosition();
    this.startAnimation();
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.stopAnimation();
    if (this.resumeTimeout) {
      clearTimeout(this.resumeTimeout);
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    this.stopAnimation();
    if (this.resumeTimeout) {
      clearTimeout(this.resumeTimeout);
    }
    this.updateCardWidth();
    this.speed = window.innerWidth <= 768 ? 1 : 2;
    this.adjustPosition();
    this.startAnimation();
    this.cdr.detectChanges();
  }

  updateCardWidth(): void {
    if (this.servicesTrack?.nativeElement) {
      const card = this.servicesTrack.nativeElement.children[0];
      if (card) {
        this.cardWidth = card.offsetWidth;
      }
    }
  }

  adjustPosition(): void {
    if (!this.servicesTrack?.nativeElement) return;

    const trackWidth = this.getTrackWidth();
    const containerWidth = this.getContainerWidth();
    const leftBound = this.marginOffset;
    const rightBound = -trackWidth + containerWidth - this.marginOffset;

    if (this.selectedIndex !== null && !this.isAutoScroll) {
      const containerCenter = containerWidth / 2;
      const card =
        this.servicesTrack.nativeElement.children[this.selectedIndex];
      const cardRect = card.getBoundingClientRect();
      const cardCenter =
        cardRect.left -
        this.servicesTrack.nativeElement.parentElement.getBoundingClientRect()
          .left +
        cardRect.width / 2;
      this.currentPosition = -(cardCenter - containerCenter);
    }

    this.currentPosition = Math.min(
      leftBound,
      Math.max(rightBound, this.currentPosition)
    );

    this.isFirstCard = this.currentPosition >= leftBound - 1;
    this.isLastCard = this.currentPosition <= rightBound + 1;

    this.updateTrackPosition();
    this.updateActiveCard();
    this.cdr.detectChanges();
  }

  startAnimation(): void {
    this.stopAnimation();
    if (!this.servicesTrack?.nativeElement) return;

    const animate = () => {
      if (this.isPaused || !this.servicesTrack?.nativeElement) {
        this.animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const trackWidth = this.getTrackWidth();
      const containerWidth = this.getContainerWidth();
      const leftBound = this.marginOffset;
      const rightBound = -trackWidth + containerWidth - this.marginOffset;

      if (this.direction === 'left') {
        this.currentPosition -= this.speed;

        if (this.currentPosition <= rightBound) {
          this.currentPosition = rightBound;
          this.isPaused = true;
          this.isLastCard = true;
          this.isFirstCard = false;
          this.isAutoScroll = true;
          this.updateTrackPosition();
          this.updateActiveCard();
          this.cdr.detectChanges();

          if (this.resumeTimeout) clearTimeout(this.resumeTimeout);
          this.resumeTimeout = setTimeout(() => {
            this.isPaused = false;
            this.direction = 'right';
            this.updateActiveCard();
            this.cdr.detectChanges();
            this.animationFrameId = requestAnimationFrame(animate);
          }, this.pauseDuration);
          return;
        }
      } else {
        this.currentPosition += this.speed;

        if (this.currentPosition >= leftBound) {
          this.currentPosition = leftBound;
          this.isPaused = true;
          this.isFirstCard = true;
          this.isLastCard = false;
          this.isAutoScroll = true;
          this.updateTrackPosition();
          this.updateActiveCard();
          this.cdr.detectChanges();

          if (this.resumeTimeout) clearTimeout(this.resumeTimeout);
          this.resumeTimeout = setTimeout(() => {
            this.isPaused = false;
            this.direction = 'left';
            this.updateActiveCard();
            this.cdr.detectChanges();
            this.animationFrameId = requestAnimationFrame(animate);
          }, this.pauseDuration);
          return;
        }
      }

      this.isFirstCard = this.currentPosition >= leftBound - 1;
      this.isLastCard = this.currentPosition <= rightBound + 1;

      this.updateTrackPosition();
      this.cdr.detectChanges();

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

  updateTrackPosition(): void {
    if (this.servicesTrack?.nativeElement) {
      const track = this.servicesTrack.nativeElement;
      track.style.transform = `translateX(${this.currentPosition}px)`;
    }
  }

  getTrackWidth(): number {
    return this.cardWidth
      ? (this.cardWidth + this.gap) * this.services.length - this.gap
      : 0;
  }

  getContainerWidth(): number {
    return this.servicesTrack?.nativeElement?.parentElement?.offsetWidth || 0;
  }

  updateActiveCard(): void {
    if (!this.servicesTrack?.nativeElement) return;

    const cards = Array.from(this.servicesTrack.nativeElement.children);
    cards.forEach((card: any, i: number) => {
      if (i === this.selectedIndex && !this.isAutoScroll) {
        card.classList.add('zoomed-card');
      } else {
        card.classList.remove('zoomed-card');
      }
    });
  }

  centerCard(index: number): void {
    if (!this.servicesTrack?.nativeElement) return;

    this.isPaused = true;
    this.stopAnimation();
    this.selectedIndex = index;
    this.isAutoScroll = false;

    const containerWidth = this.getContainerWidth();
    const containerCenter = containerWidth / 2;
    const card = this.servicesTrack.nativeElement.children[index];
    const cardRect = card.getBoundingClientRect();
    const cardCenter =
      cardRect.left -
      this.servicesTrack.nativeElement.parentElement.getBoundingClientRect()
        .left +
      cardRect.width / 2;

    this.currentPosition = -(cardCenter - containerCenter);
    this.currentPosition = Math.min(
      this.marginOffset,
      Math.max(
        -this.getTrackWidth() + this.getContainerWidth() - this.marginOffset,
        this.currentPosition
      )
    );

    this.isFirstCard = index === 0;
    this.isLastCard = index === this.services.length - 1;
    this.updateTrackPosition();
    this.updateActiveCard();
    this.cdr.detectChanges();

    if (this.resumeTimeout) clearTimeout(this.resumeTimeout);
    this.resumeTimeout = setTimeout(() => {
      this.isPaused = false;
      this.selectedIndex = null;
      this.isFirstCard = false;
      this.isLastCard = false;
      this.isAutoScroll = true;
      this.updateActiveCard();
      this.cdr.detectChanges();
      this.startAnimation();
    }, this.pauseDuration);
  }

  scroll(direction: 'left' | 'right'): void {
    if (!this.servicesTrack?.nativeElement) return;

    this.isPaused = true;
    this.stopAnimation();
    this.isAutoScroll = false;

    const step = this.cardWidth + this.gap;
    const trackWidth = this.getTrackWidth();
    const containerWidth = this.getContainerWidth();
    const leftBound = this.marginOffset;
    const rightBound = -trackWidth + containerWidth - this.marginOffset;

    let newIndex =
      this.selectedIndex !== null
        ? this.selectedIndex
        : this.findCurrentCenterIndex();

    if (direction === 'left' && newIndex > 0) {
      newIndex--;
      this.currentPosition += step;
    } else if (direction === 'right' && newIndex < this.services.length - 1) {
      newIndex++;
      this.currentPosition -= step;
    }

    this.currentPosition = Math.min(
      leftBound,
      Math.max(rightBound, this.currentPosition)
    );

    this.selectedIndex = newIndex;
    this.isFirstCard = newIndex === 0;
    this.isLastCard = newIndex === this.services.length - 1;

    this.updateTrackPosition();
    this.updateActiveCard();
    this.cdr.detectChanges();

    if (this.resumeTimeout) clearTimeout(this.resumeTimeout);
    this.resumeTimeout = setTimeout(() => {
      this.isPaused = false;
      this.selectedIndex = null;
      this.isFirstCard = false;
      this.isLastCard = false;
      this.isAutoScroll = true;
      this.updateActiveCard();
      this.cdr.detectChanges();
      this.startAnimation();
    }, this.pauseDuration);
  }

  findCurrentCenterIndex(): number {
    if (!this.servicesTrack?.nativeElement) return 0;

    const containerWidth = this.getContainerWidth();
    const containerCenter = containerWidth / 2;

    let closestIndex = 0;
    let smallestDistance = Infinity;

    Array.from<HTMLElement>(this.servicesTrack.nativeElement.children).forEach(
      (child, index) => {
        const rect = child.getBoundingClientRect();
        const cardCenter =
          rect.left -
          this.servicesTrack.nativeElement.parentElement.getBoundingClientRect()
            .left +
          rect.width / 2;
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
