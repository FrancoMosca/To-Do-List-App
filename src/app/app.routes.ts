import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { reverseAuthGuard } from './shared/guards/reverse-auth.guard';
import { onlyLoggedInGuard } from './shared/guards/only-logged-in.guard';

export const routes: Routes = [
  {
    path: 'user/sign-in',
    canActivate: [authGuard,reverseAuthGuard],
    loadComponent: () =>
      import('./pages/users/sign-in/sign-in.component').then(
        (m) => m.SignInComponent
      ),
  },
  {
    path: 'user/sign-up',
    canActivate: [authGuard,reverseAuthGuard],
    loadComponent: () =>
      import('./pages/users/sign-up/sign-up.component').then(
        (m) => m.SignUpComponent
      ),
  },
  {
    path: 'home',
    canActivate:[onlyLoggedInGuard],
    loadComponent: () =>
      import('./pages/home/home.component').then(
        (m) => m.HomeComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  
];