import { Component, HostListener, ChangeDetectorRef } from '@angular/core';
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
  constructor(private sanitizer: DomSanitizer,   private changeDetector: ChangeDetectorRef
  ) {}

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
    {
      id: 9,
      name: 'Ахмадуллина<br>Александра',
      position: 'Frontend Developer',
      category: 'Frontend developers',
      photo: 'assets/team/sasha.png',
    },
    {
      id: 10,
      name: 'Салахов<br>Тагир',
      position: 'Frontend Developer',
      category: 'Frontend developers',
      photo: 'assets/team/tagir.png',
    },
    {
      id: 11,
      name: 'Ахмадуллина<br>Александра',
      position: 'Frontend Developer',
      category: 'Frontend developers',
      photo: 'assets/team/sasha.png',
    },
    {
      id: 12,
      name: 'Салахов<br>Тагир',
      position: 'Frontend Developer',
      category: 'Frontend developers',
      photo: 'assets/team/tagir.png',
    },
    {
      id: 13,
      name: 'Ахмадуллина<br>Александра',
      position: 'Frontend Developer',
      category: 'Frontend developers',
      photo: 'assets/team/sasha.png',
    },
    {
      id: 14,
      name: 'Салахов<br>Тагир',
      position: 'Frontend Developer',
      category: 'Frontend developers',
      photo: 'assets/team/tagir.png',
    },
    {
      id: 15,
      name: 'Ашот<br>Тагир',
      position: 'UX/UI designer',
      category: 'UX/UI designers',
      photo: 'assets/team/tagir.png',
    },
    {
      id: 16,
      name: 'Ашот<br>Тагир',
      position: 'CEO',
      category: 'CEO',
      photo: 'assets/team/tagir.png',
    },
    {
      id: 17,
      name: 'Ашот<br>Тагир',
      position: 'CEO',
      category: 'CEO',
      photo: 'assets/team/tagir.png',
    },
  ];

  // Добавляем метод isMobile в компонент
isMobile(): boolean {
  return window.innerWidth <= 576;
}

// Добавляем обработчик изменения размера окна
@HostListener('window:resize', ['$event'])
onResize(event: any) {
  // Принудительно запускаем обнаружение изменений
  this.changeDetector.detectChanges();
}

  get filteredMembers(): TeamMember[] {
    if (!this.activeCategory) {
      return this.teamMembers.slice(0, 8);
    }
    return this.teamMembers.filter(
      (member) => member.category === this.activeCategory
    );
  }

  getGridStyle(): any {
    const membersCount = this.filteredMembers.length;
    
    // Для десктопа (1-4 участника)
    if (!this.isMobile() && membersCount <= 4) {
      return {
        'grid-template-rows': '1fr',
        'grid-auto-columns': 'max(150px, calc(25% - 15px))'
      };
    }
    
    // Для мобильных (1-2 участника)
    if (this.isMobile() && membersCount <= 2) {
      return {
        'grid-template-rows': '1fr',
        'grid-auto-columns': 'max(150px, calc(25% - 10px))'
      };
    }
    
    return {
      'grid-auto-columns': 'max(150px, calc(25% - 15px))'
    };
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
