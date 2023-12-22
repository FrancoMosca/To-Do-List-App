import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  User,
} from '@angular/fire/auth';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from '../../../shared/services/store.service';

interface ErrorResponse {
  code: string;
  message: string;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth = inject(Auth);
  router = inject(Router);
  store = inject(StoreService);
  googleProvider = new GoogleAuthProvider();
  currentUser = signal<User | undefined>(undefined);

  constructor() {
    this.userState$.subscribe((user) => this.currentUser.set(user!));
  }

  get userState$() {
    return authState(this.auth);
  }

  async signInGoogle(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await signInWithPopup(this.auth, this.googleProvider);
        onAuthStateChanged(this.auth, async (user: User | null) => {
          if (user) {
            this.currentUser.set(user);
            const userExists = await this.store.documentExists(
              'users',
              user.uid
            );
            if (!userExists) {
              // Si el usuario no existe en la colección 'users', lo agregamos
              await this.store.addDocument(
                'users',
                {
                  uid: user.uid,
                  displayName: user.displayName,
                  email: user.email,
                  tasks: [],
                },
                user.uid
              );
            }
          }
          resolve(); // Resuelve la promesa cuando la autenticación está completa
        });
        this.router.navigate(['/home']);
      } catch (error) {
        console.log('Google login', error);
        reject(error); // Rechaza la promesa en caso de error
      }
    });
  }

  async signUp(email: string, password: string): Promise<void> {
    try {
      const { user } = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      this.router.navigate(['/user/email-verification']);
    } catch (error: unknown) {
      const { code, message } = error as ErrorResponse;
      console.log('Code ', code);
      console.log('Message ', message);
    }
  }

  async signIn(email: string, password: string): Promise<void> {
    try {
      const { user } = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      this.checkUserIsVerified(user);
    } catch (error: unknown) {
      const { code, message } = error as ErrorResponse;
      console.log('Code ', code);
      console.log('Message ', message);
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.auth.signOut();
      this.currentUser.set(undefined);
    } catch (error: unknown) {
      console.log(error);
    }
  }

  private checkUserIsVerified(user: User): void {
    const route = user.emailVerified
      ? '/user/profile'
      : '/user/email-verification';
    this.router.navigate([route]);
  }
}
