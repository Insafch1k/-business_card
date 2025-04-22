import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit, OnDestroy {
  @ViewChild('servicesTrack') servicesTrack!: ElementRef;

  originalServices = [
    { id: 1, title: 'Создание сайта', image: 'assets/services/site.png', anchor: 'zakaz' },
    { id: 2, title: 'Разработка Telegram-бота', image: 'assets/services/bot.png', anchor: 'zakaz' },
    { id: 3, title: 'Разработка мобильного приложения', image: 'assets/services/mob.png', anchor: 'zakaz' },
    { id: 4, title: 'Разработка Web-приложения', image: 'assets/services/web.png', anchor: 'zakaz' },
    { id: 5, title: 'CRM-системы', image: 'assets/services/crm.png', anchor: 'zakaz' }
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
  // Текущий индекс центральной карточки
  currentCenterIndex: number = 0;
  // Флаг для отслеживания, должна ли анимация возобновиться
  shouldResumeAnimation = true;
  // Счетчик активных операций для отслеживания множественных нажатий
  pendingOperations = 0;

  ngOnInit(): void {
    this.prepareCarousel();
    this.startAnimation();
  }

  prepareCarousel(): void {
    this.services = [...this.originalServices, ...this.originalServices, ...this.originalServices];
    this.singleCycleWidth = (this.cardWidth + this.gap) * this.originalServices.length;
  }

  ngOnDestroy(): void {
    this.stopAnimation();
    clearTimeout(this.resumeTimeout);
  }

  startAnimation(): void {
    // Если анимация уже запущена, не запускаем её снова
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

  // Центрирование карточки с анимацией
  centerCard(index: number): void {
    // Инкрементируем счетчик операций
    this.pendingOperations++;
    
    // Запоминаем, что анимация должна возобновиться, если она была активна
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
    const cardCenter = cardRect.left - container.getBoundingClientRect().left + cardRect.width / 2;
    
    const offset = cardCenter - containerCenter;
    this.currentPosition -= offset;
    
    this.updateTrackPosition(true);
    
    // Добавляем класс для анимации приближения
    card.classList.add('zoomed-card');
    
    // Удаляем класс у других карточек
    Array.from(this.servicesTrack.nativeElement.children).forEach((child: unknown, i: number) => {
      if (i !== index && child instanceof HTMLElement) {
        child.classList.remove('zoomed-card');
      }
    });

    // Сохраняем текущее значение счетчика для замыкания
    const currentOperation = this.pendingOperations;
    
    clearTimeout(this.resumeTimeout);
    this.resumeTimeout = setTimeout(() => {
      // Проверяем, что это последняя операция
      if (currentOperation === this.pendingOperations) {
        this.isPaused = false;
        this.selectedIndex = null;
        // Убираем класс приближения после паузы
        card.classList.remove('zoomed-card');
        
        // Перезапускаем анимацию, если была активна до паузы
        if (this.shouldResumeAnimation) {
          this.startAnimation();
        }
      }
    }, this.pauseDuration);
  }

  // Обработчик клика по карточке
  onCardClick(index: number): void {
    this.centerCard(index);
  }

  // Навигация кнопками
  scroll(direction: 'left' | 'right'): void {
    // Инкрементируем счетчик операций
    this.pendingOperations++;
    
    // Запоминаем, что анимация должна возобновиться, если она была активна
    if (!this.isPaused && this.animationFrameId !== null) {
      this.shouldResumeAnimation = true;
    }
    
    this.isPaused = true;
    this.stopAnimation();

    // Определяем новый индекс центральной карточки
    let newIndex: number;
    if (direction === 'left') {
      newIndex = this.findCurrentCenterIndex() - 1;
    } else {
      newIndex = this.findCurrentCenterIndex() + 1;
    }

    // Корректируем индекс если вышли за границы
    if (newIndex >= this.services.length) newIndex = 0;
    if (newIndex < 0) newIndex = this.services.length - 1;

    // Центрируем новую карточку
    const card = this.servicesTrack.nativeElement.children[newIndex];
    
    // Центрирование карточки
    const container = this.servicesTrack.nativeElement.parentElement;
    const containerWidth = container.offsetWidth;
    const containerCenter = containerWidth / 2;
    
    const cardRect = card.getBoundingClientRect();
    const cardCenter = cardRect.left - container.getBoundingClientRect().left + cardRect.width / 2;
    
    const offset = cardCenter - containerCenter;
    this.currentPosition -= offset;
    
    this.updateTrackPosition(true);
    
    // Добавляем класс для анимации приближения
    card.classList.add('zoomed-card');
    
    // Удаляем класс у других карточек
    Array.from(this.servicesTrack.nativeElement.children).forEach((child: unknown, i: number) => {
      if (i !== newIndex && child instanceof HTMLElement) {
        child.classList.remove('zoomed-card');
      }
    });
    
    this.selectedIndex = newIndex;
    
    // Сохраняем текущее значение счетчика для замыкания
    const currentOperation = this.pendingOperations;
    
    // Устанавливаем таймаут для возобновления анимации
    clearTimeout(this.resumeTimeout);
    this.resumeTimeout = setTimeout(() => {
      // Проверяем, что это последняя операция
      if (currentOperation === this.pendingOperations) {
        this.isPaused = false;
        this.selectedIndex = null;
        // Убираем класс приближения после паузы
        card.classList.remove('zoomed-card');
        
        // Перезапускаем анимацию, если была активна до паузы
        if (this.shouldResumeAnimation) {
          this.startAnimation();
        }
      }
    }, this.pauseDuration);
  }

  // Находим индекс карточки, которая сейчас ближе всего к центру
  findCurrentCenterIndex(): number {
    const container = this.servicesTrack.nativeElement.parentElement;
    const containerWidth = container.offsetWidth;
    const containerCenter = containerWidth / 2;
    
    let closestIndex = 0;
    let smallestDistance = Infinity;
  
    // Явно указываем тип для child
    Array.from<HTMLElement>(this.servicesTrack.nativeElement.children).forEach((child, index) => {
      const rect = child.getBoundingClientRect();
      const cardCenter = rect.left - container.getBoundingClientRect().left + rect.width / 2;
      const distance = Math.abs(cardCenter - containerCenter);
      
      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestIndex = index;
      }
    });
  
    return closestIndex;
  }

  trackByFn(index: number, item: any): number {
    return item.id;
  }
}