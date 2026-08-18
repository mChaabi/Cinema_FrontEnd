import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.html',
  styleUrls: ['./auth.scss']
})
export class AuthComponent {
  isLoginMode = true; // Bascule entre Connexion et Inscription

  // Modèle aligné avec l'entité Java (User.java)
  authData = {
    username: '',
    email: '',
    password: ''
  };

  constructor(private router: Router) {}

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(): void {
    if (this.isLoginMode) {
      console.log('Connexion de :', this.authData.username, this.authData.password);
      // Logique d'authentification puis redirection
      this.router.navigate(['/']);
    } else {
      console.log('Inscription de :', this.authData);
      // Logique d'enregistrement de l'utilisateur
      this.isLoginMode = true;
    }
  }
}