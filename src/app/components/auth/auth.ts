import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.html',
  styleUrls: ['./auth.scss']
})
export class AuthComponent {
  isLoginMode = true;
  errorMessage = '';

  authData = {
    username: '',
    email: '',
    password: ''
  };

  private router = inject(Router);
  private userService = inject(UserService);
  private authService = inject(AuthService);

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.isLoginMode) {
      this.userService.login({
        username: this.authData.username,
        password: this.authData.password
      }).subscribe({
        next: (user) => {
          this.authService.setUser(user);
          this.router.navigateByUrl('/');   
        },
        error: (err) => {
          this.errorMessage = err.error?.message ||
            (typeof err.error === 'string' ? err.error : null) ||
            "Nom d'utilisateur ou mot de passe incorrect.";
        }
      });
    } else {
      this.userService.createUser(this.authData as any).subscribe({
        next: () => {
          alert('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
          this.isLoginMode = true;
          this.authData = { username: '', email: '', password: '' };
        },
        error: (err) => {
          this.errorMessage = err.error?.message ||
            (typeof err.error === 'string' ? err.error : null) ||
            "Erreur lors de la création du compte.";
        }
      });
    }
  }
}