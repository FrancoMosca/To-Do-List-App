import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthFormComponent } from '../../../shared/components/auth-form/auth-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, AuthFormComponent, RouterOutlet],
  template: `<app-auth-form [action]="'signUp'" />`,
})
export class SignUpComponent {

}
