import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import HomeComponent from './components/home/home.component';
import { BurgerMenuComponent } from './burger-menu/burger-menu.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { title: 'Главная' },
  },
  {
    path: 'burger-menu',
    component: BurgerMenuComponent,
    data: { title: 'Меню' },
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'disabled',
      anchorScrolling: 'disabled', 
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
