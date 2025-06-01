import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Category {
  displayName: string;
  icon: string;
  isWide?: boolean;
}

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class TeamComponent {
  categories: Category[] = [
    {
      displayName: 'ML',
      icon: '/assets/icons/ml.gif',
    },
    {
      displayName: 'FRONTEND',
      icon: '/assets/icons/front.gif',
    },
    {
      displayName: 'UX/UI DESIGN',
      icon: '/assets/icons/design.gif',
    },
    {
      displayName: 'BACKEND',
      icon: '/assets/icons/back.gif',
    },
    {
      displayName: 'MOBILE DEVELOPMENT',
      icon: '/assets/icons/mobile.gif',
      isWide: true,
    },
  ];
}
