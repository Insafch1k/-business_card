import { Component } from '@angular/core';

interface Project {
  image: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent {
  projects: Project[] = [
    {
      image: '../../../assets/Projects/nedvizhka.svg',
      title: 'Nedvizhka',
      description: 'Telegram App по поиску недвижимости',
    },
    {
      image: '../../../assets/Projects/klinika.svg',
      title: 'Klinika 03',
      description: 'Сайт для "Клиника 03"',
    },
    {
      image: '../../../assets/Projects/hidra.svg',
      title: 'Zilant Hydro',
      description: 'Проектирование схем водоснабжения "Zilant Hydro"',
    },
  ];

  currentIndex = 0;
  nextIndex = 1;
  direction: 'left' | 'right' = 'right';
  isAnimating = false;

  get currentProject(): Project {
    return this.projects[this.currentIndex];
  }

  get nextProject(): Project {
    return this.projects[this.nextIndex];
  }

  next(): void {
    if (this.isAnimating) return;

    this.direction = 'right';
    this.nextIndex = (this.currentIndex + 1) % this.projects.length;
    this.isAnimating = true;

    setTimeout(() => {
      this.currentIndex = this.nextIndex;
      this.isAnimating = false;
    }, 500);
  }

  prev(): void {
    if (this.isAnimating) return;

    this.direction = 'left';
    this.nextIndex =
      (this.currentIndex - 1 + this.projects.length) % this.projects.length;
    this.isAnimating = true;

    setTimeout(() => {
      this.currentIndex = this.nextIndex;
      this.isAnimating = false;
    }, 500);
  }

  goTo(index: number): void {
    if (this.isAnimating || index === this.currentIndex) return;

    this.direction = index > this.currentIndex ? 'right' : 'left';
    this.nextIndex = index;
    this.isAnimating = true;

    setTimeout(() => {
      this.currentIndex = index;
      this.isAnimating = false;
    }, 500);
  }
}
