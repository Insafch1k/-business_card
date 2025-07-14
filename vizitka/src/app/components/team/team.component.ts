import {
  Component,
  AfterViewInit,
  ElementRef,
  QueryList,
  ViewChildren,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

interface Category {
  displayName: string;
  icon: string;
  alt: string;
  isWide?: boolean;
}

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class TeamComponent implements AfterViewInit, OnDestroy {
  categories: Category[] = [
    {
      displayName: 'ML',
      icon: '/assets/icons/ml.webm',
      alt: 'обучение моделей, внедрение искусственного интеллекта казань, Сбор и обработка данных, Встраивание готового решения',
    },
    {
      displayName: 'FRONTEND',
      icon: '/assets/icons/front.webm',
      alt: 'корпоративный сайт заказать,веб-студия Казань,заказать лендинг под ключ казань,заказать сайт казань,разработка сайтов казань',
    },
    {
      displayName: 'UX/UI DESIGN',
      icon: '/assets/icons/design.webm',
      alt: 'услуги веб-дизайна казань,дизайн лендинга казань',
    },
    {
      displayName: 'BACKEND',
      icon: '/assets/icons/back.webm',
      alt: 'корпоративный сайт заказать,веб-студия Казань,заказать лендинг под ключ казань,заказать сайт казань,разработка сайтов казань',
    },
    {
      displayName: 'MOBILE DEVELOPMENT',
      icon: '/assets/icons/mobile.webm',
      alt: 'Разработка мобильных приложений казань, заказать мобильное приложение казань',
      isWide: true,
    },
  ];

  @ViewChildren('categoryVideo')
  videos!: QueryList<ElementRef<HTMLVideoElement>>;

  @ViewChild('teamsection', { static: true })
  teamSection!: ElementRef<HTMLElement>;

  private sectionObserver?: IntersectionObserver;
  private isSectionVisible = false;

  private visibilityChangeHandler = () => {
    if (document.hidden) {
      this.videos.forEach((video) => video.nativeElement.pause());
    } else if (this.isSectionVisible) {
      this.playVideos();
    }
  };

  ngAfterViewInit(): void {
    this.sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.isSectionVisible = entry.isIntersecting;
          if (entry.isIntersecting) {
            this.playVideos();
          } else {
            this.videos.forEach((video) => video.nativeElement.pause());
          }
        });
      },
      { threshold: 0 } // Срабатывает, когда любая часть секции видна
    );

    if (this.teamSection) {
      this.sectionObserver.observe(this.teamSection.nativeElement);
    }

    document.addEventListener('visibilitychange', this.visibilityChangeHandler);
  }

  private playVideo(video: HTMLVideoElement): void {
    video.muted = true;
    video.playsInline = true;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.debug(`Автозапуск видео заблокирован: ${error.message}`);
      });
    }
  }

  private playVideos(): void {
    this.videos.forEach((video) => {
      this.playVideo(video.nativeElement);
    });
  }

  ngOnDestroy(): void {
    document.removeEventListener(
      'visibilitychange',
      this.visibilityChangeHandler
    );

    if (this.sectionObserver) {
      this.sectionObserver.disconnect();
    }
  }
}
