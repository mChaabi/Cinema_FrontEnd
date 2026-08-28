import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user';

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

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
  }

 onSubmit(): void {
  this.errorMessage = '';

  if (this.isLoginMode) {
    // LOGIN
    this.userService.login({
      username: this.authData.username,
      password: this.authData.password
    }).subscribe({
      next: (user) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.router.navigate(['/']);
      },
      error: (err) => {
        // Captura el mensaje en JSON o en texto plano
        this.errorMessage = err.error?.message || 
                            (typeof err.error === 'string' ? err.error : null) || 
                            "Nom d'utilisateur ou mot de passe incorrect.";
      }
    });

  } else {
    // REGISTRO
    this.userService.createUser(this.authData as any).subscribe({
      next: (userCree) => {
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