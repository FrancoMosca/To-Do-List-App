import { computed, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../pages/users/services/auth.service';
import { take, tap } from 'rxjs/operators';

export const authGuard = () => {
  const _authService = inject(AuthService);
  const router = inject(Router);
  return _authService.userState$.pipe(
    take(1),
    tap((isLoggedIn) => (!!isLoggedIn ? router.navigate(['/user/sign-in']) : true))
  );
};
