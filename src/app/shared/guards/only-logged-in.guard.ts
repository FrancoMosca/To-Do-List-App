import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../pages/users/services/auth.service';
import { take, tap } from 'rxjs';

export const onlyLoggedInGuard = () => {
    const _authService = inject(AuthService);
    const router = inject(Router);
    return _authService.userState$.pipe(
      take(1),
      tap((isLoggedIn) =>
        !!isLoggedIn ? true :   router.navigate(['/user/sign-in'])
      )
    );
};
