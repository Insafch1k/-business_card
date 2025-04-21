import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

interface Project {
  image: string;
  title: string;
  description: string;
  link: string;
}

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  animations: [
    trigger('fadeAnimation', [
      transition('* => *', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class ProjectsComponent {
  projects: Project[] = [
    {
      image: '../../../assets/Projects/nedvizhka.svg',
      title: 'Nedvizhka',
      description: 'Telegram App по поиску недвижимости',
      link: 'https://clinika03.ru/main',
    },
    {
      image: '../../../assets/Projects/klinika.svg',
      title: 'Klinika 03',
      description: 'Сайт для "Клиника 03"',
      link: 'https://clinika03.ru/main',
    },
    {
      image: '../../../assets/Projects/hidra.svg',
      title: 'Zilant Hydro',
      description: 'Проектирование схем водоснабжения "Zilant Hydro"',
      link: 'https://clinika03.ru/main',
    },
  ];

  currentIndex = 0;
  showImage = true;

  get currentProject(): Project {
    return this.projects[this.currentIndex];
  }

  next(): void {
    this.triggerImageChange(() => {
      this.currentIndex = (this.currentIndex + 1) % this.projects.length;
    });
  }

  prev(): void {
    this.triggerImageChange(() => {
      this.currentIndex =
        (this.currentIndex - 1 + this.projects.length) % this.projects.length;
    });
  }

  goTo(index: number): void {
    this.triggerImageChange(() => {
      this.currentIndex = index;
    });
  }

  private triggerImageChange(changeFn: () => void): void {
    this.showImage = false;
    setTimeout(() => {
      changeFn();
      this.showImage = true;
    }, 50);
  }
}
