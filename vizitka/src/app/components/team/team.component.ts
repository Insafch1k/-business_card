import { Component } from '@angular/core';

interface TeamMember {
  id: number;
  name: string;
  position: string;
  category: string;
  photo: string;
}

interface Category {
  name: string;
  icon: string;
}

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent {
  categories: Category[] = [
    { name: 'Backend\ndevelopers', icon: 'assets/icons/back.svg' },
    { name: 'ML\ndevelopers', icon: 'assets/icons/ml.svg' },
    { name: 'UX/UI\ndesigners', icon: 'assets/icons/uxui.svg' },
    { name: 'CEO', icon: 'assets/icons/ceo.svg' },
    { name: 'Frontend\ndevelopers', icon: 'assets/icons/front.svg' }
  ];
  activeCategory: string | null = null; // Никакая категория не выбрана изначально

  teamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'Ахмедшин<br>Ратмир',
      position: 'Backend Developer',
      category: 'Backend\ndevelopers',
      photo: 'assets/team/ратмир.JPG'
    },
    {
      id: 2,
      name: 'Шаймарданов<br>Марат',
      position: 'Backend Developer',
      category: 'Backend\ndevelopers',
      photo: 'assets/team/марат.JPG'
    },
    {
      id: 3,
      name: 'Ахмадуллина<br>Александра',
      position: 'Frontend Developer',
      category: 'Frontend\ndevelopers',
      photo: 'assets/team/равиль.JPG'
    },
    {
      id: 4,
      name: 'Салахов<br>Тагир',
      position: 'Frontend Developer',
      category: 'Frontend\ndevelopers',
      photo: 'assets/team/тагир.JPG'
    },
    {
      id: 5,
      name: 'Ахмедшин<br>Ратмир',
      position: 'Backend Developer',
      category: 'Backend\ndevelopers',
      photo: 'assets/team/ратмир.JPG'
    },
    {
      id: 6,
      name: 'Шаймарданов<br>Марат',
      position: 'Backend Developer',
      category: 'Backend\ndevelopers',
      photo: 'assets/team/марат.JPG'
    },
    {
      id: 7,
      name: 'Ахмадуллина<br>Александра',
      position: 'Frontend Developer',
      category: 'Frontend\ndevelopers',
      photo: 'assets/team/равиль.JPG'
    },
    {
      id: 8,
      name: 'Салахов<br>Тагир',
      position: 'Frontend Developer',
      category: 'Frontend\ndevelopers',
      photo: 'assets/team/тагир.JPG'
    },

  ];

  get filteredMembers(): TeamMember[] {
    // Если не выбрана категория или категория null - показываем всех
    if (!this.activeCategory) {
      return this.teamMembers;
    }
    return this.teamMembers.filter(member => member.category === this.activeCategory);
  }

  setCategory(category: string): void {
    // Переключаем категорию при клике
    this.activeCategory = this.activeCategory === category ? null : category;
  }
}