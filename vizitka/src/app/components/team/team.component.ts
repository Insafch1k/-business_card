import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

interface TeamMember {
  id: number;
  name: string;
  position: string;
  category: string;
  photo: string;
}

interface Category {
  name: string;
  displayName: string; //поле для HTML-форматирования
  icon: string;
}

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class TeamComponent {
  constructor(private sanitizer: DomSanitizer) {}

  categories: Category[] = [
    {
      name: 'Backend developers',
      displayName: 'Backend<br>developers',
      icon: 'assets/icons/back.svg',
    },
    {
      name: 'ML developers',
      displayName: 'ML<br>developers',
      icon: 'assets/icons/ml.svg',
    },
    {
      name: 'UX/UI designers',
      displayName: 'UX/UI<br>designers',
      icon: 'assets/icons/uxui.svg',
    },
    { name: 'CEO', displayName: 'CEO', icon: 'assets/icons/ceo.svg' },
    {
      name: 'Frontend developers',
      displayName: 'Frontend<br>developers',
      icon: 'assets/icons/front.svg',
    },
  ];
  activeCategory: string | null = null;

  teamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'Ахмедшин<br>Ратмир',
      position: 'Backend Developer',
      category: 'Backend developers',
      photo: 'assets/team/ratmir.png',
    },
    {
      id: 2,
      name: 'Шаймарданов<br>Марат',
      position: 'Backend Developer',
      category: 'Backend developers',
      photo: 'assets/team/marat.png',
    },
    {
      id: 3,
      name: 'Ахмадуллина<br>Александра',
      position: 'Frontend Developer',
      category: 'Frontend developers',
      photo: 'assets/team/sasha.png',
    },
    {
      id: 4,
      name: 'Салахов<br>Тагир',
      position: 'Frontend Developer',
      category: 'Frontend developers',
      photo: 'assets/team/tagir.png',
    },
    {
      id: 5,
      name: 'Ахмедшин<br>Ратмир',
      position: 'Backend Developer',
      category: 'Backend developers',
      photo: 'assets/team/ratmir.png',
    },
    {
      id: 6,
      name: 'Шаймарданов<br>Марат',
      position: 'Backend Developer',
      category: 'Backend developers',
      photo: 'assets/team/marat.png',
    },
    {
      id: 7,
      name: 'Ахмадуллина<br>Александра',
      position: 'Frontend Developer',
      category: 'Frontend developers',
      photo: 'assets/team/sasha.png',
    },
    {
      id: 8,
      name: 'Салахов<br>Тагир',
      position: 'Frontend Developer',
      category: 'Frontend developers',
      photo: 'assets/team/tagir.png',
    },
  ];

  get filteredMembers(): TeamMember[] {
    if (!this.activeCategory) {
      return this.teamMembers.slice(0, 8);
    }
    return this.teamMembers.filter(
      (member) => member.category === this.activeCategory
    );
  }

  setCategory(category: string): void {
    this.activeCategory = this.activeCategory === category ? null : category;
  }

  //для  вывода HTML
  safeHtml(html: string) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  ngAfterViewInit() {
    this.checkItemsCount();
  }
  
  checkItemsCount() {
    const grid = document.querySelector('.team-grid');
    if (!grid) return;
  
    const items = grid.querySelectorAll('.team-member');
    grid.classList.toggle('odd', items.length % 2 !== 0);
  }
}
