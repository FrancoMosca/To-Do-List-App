import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthFormComponent } from '../../../shared/components/auth-form/auth-form.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  template: `<app-auth-form [action]="'signIn'" />`,
  standalone: true,
  imports: [CommonModule, AuthFormComponent, RouterOutlet],
})
export class SignInComponent {

}
