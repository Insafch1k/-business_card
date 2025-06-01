import {
  Component,
  ViewChild,
  ViewContainerRef,
  AfterViewInit,
  Injector,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MainComponent } from '../main/main.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, MainComponent],
})
export default class HomeComponent implements AfterViewInit {
  @ViewChild('mainContainer', { read: ViewContainerRef })
  mainContainer!: ViewContainerRef;
  @ViewChild('teamContainer', { read: ViewContainerRef })
  teamContainer!: ViewContainerRef;
  @ViewChild('servicesContainer', { read: ViewContainerRef })
  servicesContainer!: ViewContainerRef;
  @ViewChild('projectsContainer', { read: ViewContainerRef })
  projectsContainer!: ViewContainerRef;
  @ViewChild('questionsContainer', { read: ViewContainerRef })
  questionsContainer!: ViewContainerRef;
  @ViewChild('contactsContainer', { read: ViewContainerRef })
  contactsContainer!: ViewContainerRef;

  constructor(private injector: Injector, private router: Router) {}

  ngAfterViewInit() {
    this.loadComponent(MainComponent, this.mainContainer);
    this.setupIntersectionObservers();
  }

  private setupIntersectionObservers() {
    const sections = [
      {
        container: this.teamContainer,
        id: 'team',
        loadComponent: () =>
          import('../team/team.component').then((m) => m.TeamComponent),
      },
      {
        container: this.servicesContainer,
        id: 'services',
        loadComponent: () =>
          import('../services/services.component').then(
            (m) => m.ServicesComponent
          ),
      },
      {
        container: this.projectsContainer,
        id: 'projects',
        loadComponent: () =>
          import('../projects/projects.component').then(
            (m) => m.ProjectsComponent
          ),
      },
      {
        container: this.questionsContainer,
        id: 'questions',
        loadComponent: () =>
          import('../questions/questions.component').then(
            (m) => m.QuestionsComponent
          ),
      },
      {
        container: this.contactsContainer,
        id: 'contacts',
        loadComponent: () =>
          import('../contacts/contacts.component').then(
            (m) => m.ContactsComponent
          ),
      },
    ];

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        console.log(`Observing section: ${section.id}`);
        const observer = new IntersectionObserver(
          async (entries) => {
            if (entries[0].isIntersecting) {
              try {
                console.log(`Loading component for ${section.id}`);
                const Component = await section.loadComponent();
                this.loadComponent(Component, section.container);
                console.log(`Loaded component: ${section.id}`);
                observer.disconnect();
              } catch (error) {
                console.error(`Error loading section ${section.id}:`, error);
                observer.disconnect();
              }
            }
          },
          { threshold: 0.1 }
        );
        observer.observe(element);
      } else {
        console.warn(`Element with ID ${section.id} not found in DOM`);
      }
    });
  }

  private loadComponent(component: any, container: ViewContainerRef) {
    container.clear();
    container.createComponent(component, { injector: this.injector });
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
}
