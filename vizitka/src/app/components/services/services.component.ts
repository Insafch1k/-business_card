import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit, OnDestroy {
  @ViewChild('servicesTrack') servicesTrack!: ElementRef;

  services = [
    { id: 1, title: 'Создание сайта', image: 'assets/services/site.png', anchor: 'zakaz' },
    { id: 2, title: 'Разработка Telegram-бота', image: 'assets/services/bot.png', anchor: 'zakaz' },
    { id: 3, title: 'Разработка мобильного приложения', image: 'assets/services/mob.png', anchor: 'zakaz' },
    { id: 4, title: 'Разработка Web-приложения', image: 'assets/services/web.png', anchor: 'zakaz' },
    { id: 5, title: 'CRM-системы', image: 'assets/services/crm.png', anchor: 'zakaz' }
  ];

  currentPosition = 0;
  animationInterval: any;
  isPaused = false;
  cardWidth = 392; // Ширина карточки
  gap = 20; // Расстояние между карточками
  speed = 1.5;
  selectedIndex: number | null = null;
  pauseDuration = 5000; // 5 секунд 5000
  resumeTimeout: any;

  ngOnInit(): void {
    this.services = [...this.services, ...this.services, ...this.services];
    this.startAnimation();
  }

  ngOnDestroy(): void {
    this.stopAnimation();
    clearTimeout(this.resumeTimeout);
  }

  startAnimation(): void {
    this.stopAnimation();
    this.animationInterval = setInterval(() => {
      if (!this.isPaused) {
        this.currentPosition -= this.speed;
        this.updateTrackPosition();
        
        const totalWidth = (this.cardWidth + this.gap) * (this.services.length / 3);
        if (Math.abs(this.currentPosition) >= totalWidth) {
          this.currentPosition = 0;
          this.updateTrackPosition(true);
        }
      }
    }, 16);
  }

  

  stopAnimation(): void {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
  }

  updateTrackPosition(instant = false): void {
    const track = this.servicesTrack.nativeElement;
    if (instant) {
      // Жесткое позиционирование без анимации
      track.style.transition = 'transform 0.5s ease-out';
      track.style.transform = `translateX(${this.currentPosition}px)`;
      // Принудительный рефлоу для мгновенного применения
      void track.offsetWidth;
    } else {
      // Плавная анимация для автоматической прокрутки
      track.style.transition = 'transform 0.5s ease-out';
      track.style.transform = `translateX(${this.currentPosition}px)`;
    }
  }

  pauseAnimation(index: number): void {
    // Останавливаем анимацию
    this.isPaused = true;
    this.selectedIndex = index;
    
    // Получаем размеры контейнера
    const container = this.servicesTrack.nativeElement.parentElement;
    const containerWidth = container.offsetWidth;
    const containerCenter = containerWidth / 2;
    
    // Рассчитываем центр выбранной карточки
    const card = this.servicesTrack.nativeElement.children[index];
    const cardRect = card.getBoundingClientRect();
    const cardCenter = cardRect.left - container.getBoundingClientRect().left + cardRect.width / 2;
    
    // Вычисляем необходимое смещение для точного центрирования
    const offset = cardCenter - containerCenter;
    
    // Применяем коррекцию позиции
    this.currentPosition -= offset;
    
    // Принудительное обновление позиции без анимации
    this.updateTrackPosition(true);
    
    // Возобновляем анимацию через 5 секунд
    clearTimeout(this.resumeTimeout);
    this.resumeTimeout = setTimeout(() => {
      this.isPaused = false;
      this.selectedIndex = null;
    }, this.pauseDuration);
  }

  scroll(direction: 'left' | 'right'): void {
    // Ставим анимацию на паузу
    this.isPaused = true;
    this.selectedIndex = null;
    
    // Рассчитываем смещение для одной карточки
    const singleCardOffset = this.cardWidth + this.gap;
    
    if (direction === 'left') {
      // Прокрутка влево (к началу)
      this.currentPosition += singleCardOffset;
      
      // Не даем уйти за начало
      if (this.currentPosition > 0) {
        this.currentPosition = 0;
      }
    } else {
      // Прокрутка вправо (к концу)
      this.currentPosition -= singleCardOffset;
      
      // Рассчитываем максимальное смещение
      const visibleCards = Math.floor(this.servicesTrack.nativeElement.parentElement.offsetWidth / singleCardOffset);
      const maxScroll = -(this.services.length * singleCardOffset - visibleCards * singleCardOffset);
      
      // Не даем уйти за конец
      if (this.currentPosition < maxScroll) {
        this.currentPosition = maxScroll;
      }
    }
    
    // Плавное обновление позиции
    this.updateTrackPosition();
    
    // Возобновляем анимацию через 10 секунд
    clearTimeout(this.resumeTimeout);
    this.resumeTimeout = setTimeout(() => {
      this.isPaused = false;
    }, this.pauseDuration);
  }

  trackByFn(index: number, item: any): number {
    return item.id;
  }
}