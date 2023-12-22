import { RouterModule } from '@angular/router';
import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { AuthService } from '../../../pages/users/services/auth.service';
import { Observable } from 'rxjs';
import { NavbarComponent } from '../navbar/navbar.component';

const actionType = {
  signIn: {
    action: 'signIn',
    title: 'Iniciar sesion',
  },
  signUp: {
    action: 'signUp',
    title: 'Registrarse',
  },
} as const;

type ActionType = keyof typeof actionType;

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ErrorMessageComponent,
    NavbarComponent
  ],
  templateUrl: './auth-form.component.html',
})
export class AuthFormComponent implements OnInit {
  @Input() action!: ActionType;
  authForm!: FormGroup;
  title!: string;
  user$!: Observable<any>;

  private readonly _authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  
  private readonly emailPattern =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  ngOnInit(): void {
    this.title =
      this.action === actionType.signIn.action
        ? actionType.signIn.title
        : actionType.signUp.title;

    this.initForm();

    this.user$ = this._authService.userState$;
  }

  onSubmit(): void {
    const { email, password } = this.authForm.value;
    this.action === actionType.signIn.action ?
      this._authService.signIn(email, password) : this._authService.signUp(email, password);
  }

  hasError(field: string): boolean {
    const fieldName = this.authForm.get(field);
    return !!fieldName?.invalid && fieldName.touched;
  }

  signInGoogle(): void {
    this._authService.signInGoogle();
  }

  private initForm(): void {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });
  }
}
